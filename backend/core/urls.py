from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from shop.views import SitemapView, SitemapXslView
from django.views import View
from django.http import HttpResponse
import os
import re


# ─────────────────────────────────────────────
#  Helper: build an absolute media URL
# ─────────────────────────────────────────────
def _abs_media(request, image_field):
    """Return an absolute URL for a model ImageField, or empty string."""
    if not image_field:
        return ''
    try:
        relative = image_field.url          # e.g. /media/products/foo.webp
        return request.build_absolute_uri(relative)
    except Exception:
        return ''


# ─────────────────────────────────────────────
#  Helper: escape HTML special chars safely
# ─────────────────────────────────────────────
def _esc(text: str) -> str:
    return (
        str(text)
        .replace('&', '&amp;')
        .replace('"', '&quot;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
    )


# ─────────────────────────────────────────────
#  Smart SEO-Injecting Index View
# ─────────────────────────────────────────────
class IndexView(View):
    """
    Serves the Vite-built index.html for every frontend route.

    For /product/<slug> and /blog/<slug> pages it fetches SEO metadata
    from the database and REPLACES the generic meta tags in the HTML
    before sending the response.  This means Googlebot, Facebook OG
    scrapers, and SEO audit tools all see the correct product/post
    title and description on first HTTP request — without SSR.
    """

    _cached_html: str | None = None
    _cached_mtime: float | None = None

    # Patterns that trigger dynamic SEO injection
    PRODUCT_RE = re.compile(r'^/product/(?P<slug>[^/]+)/?$')
    BLOG_RE    = re.compile(r'^/blog/(?P<slug>[^/]+)/?$')

    # ── Static-file cache ──────────────────────────────────
    @classmethod
    def _get_raw_html(cls) -> str:
        index_path = os.path.join(settings.FRONTEND_DIST_DIR, 'index.html')
        try:
            mtime = os.path.getmtime(index_path)
        except FileNotFoundError:
            return '<html><body><p>Frontend not built. Run <code>npm run build</code>.</p></body></html>'

        if cls._cached_mtime != mtime:
            with open(index_path, 'r', encoding='utf-8') as f:
                cls._cached_html = f.read()
            cls._cached_mtime = mtime
        return cls._cached_html  # type: ignore[return-value]

    # ── Inject meta tags into HTML string ─────────────────
    @staticmethod
    def _inject_meta(html: str, meta: dict) -> str:
        """
        Replace <title> and key <meta>/<link> tags inside <head>
        with page-specific values, then return the modified HTML.
        """
        title    = _esc(meta.get('title', ''))
        desc     = _esc(meta.get('description', ''))
        image    = _esc(meta.get('image', ''))
        url      = _esc(meta.get('url', ''))
        keywords = _esc(meta.get('keywords', ''))

        # 1. <title>
        html = re.sub(
            r'<title>[^<]*</title>',
            f'<title>{title}</title>',
            html, count=1
        )

        # 2. Standard meta description
        html = re.sub(
            r'<meta\s+name=["\']description["\'][^>]*/?>',
            f'<meta name="description" content="{desc}" />',
            html, count=1, flags=re.IGNORECASE
        )

        # 3. Keywords
        if keywords:
            html = re.sub(
                r'<meta\s+name=["\']keywords["\'][^>]*/?>',
                f'<meta name="keywords" content="{keywords}" />',
                html, count=1, flags=re.IGNORECASE
            )

        # 4. OG tags
        og_map = {
            'og:title':       title,
            'og:description': desc,
            'og:url':         url,
            'og:image':       image,
            'og:image:alt':   title,
        }
        for prop, value in og_map.items():
            html = re.sub(
                rf'<meta\s+property=["\'{re.escape(prop)}\'"][^>]*/?>',
                f'<meta property="{prop}" content="{value}" />',
                html, count=1, flags=re.IGNORECASE
            )
            # Also handle property="…" with double quotes only
            html = re.sub(
                rf'<meta\s+property="{re.escape(prop)}"[^>]*/?>',
                f'<meta property="{prop}" content="{value}" />',
                html, count=1, flags=re.IGNORECASE
            )

        # 5. Twitter tags
        tw_map = {
            'twitter:title':       title,
            'twitter:description': desc,
            'twitter:image':       image,
        }
        for name, value in tw_map.items():
            html = re.sub(
                rf'<meta\s+name=["\'{re.escape(name)}\'"][^>]*/?>',
                f'<meta name="{name}" content="{value}" />',
                html, count=1, flags=re.IGNORECASE
            )
            html = re.sub(
                rf'<meta\s+name="{re.escape(name)}"[^>]*/?>',
                f'<meta name="{name}" content="{value}" />',
                html, count=1, flags=re.IGNORECASE
            )

        # 6. Canonical link
        canonical_tag = f'<link rel="canonical" href="{url}" />'
        if '<link rel="canonical"' in html:
            html = re.sub(
                r'<link\s+rel=["\']canonical["\'][^>]*/?>',
                canonical_tag,
                html, count=1, flags=re.IGNORECASE
            )
        else:
            html = html.replace('</head>', f'  {canonical_tag}\n  </head>', 1)

        return html

    # ── Fetch product SEO data ─────────────────────────────
    def _product_meta(self, request, slug: str) -> dict | None:
        try:
            from shop.models import Product, SiteSettings
            product = Product.objects.only(
                'name', 'slug', 'seo_title', 'seo_description',
                'seo_keywords', 'short_description', 'image'
            ).get(slug=slug, is_active=True)

            site = SiteSettings.objects.only('site_title').first()
            site_title = site.site_title if site else 'Qbamart'

            title = (product.seo_title or product.name).strip()
            full_title = f'{title} | {site_title}'

            raw_desc = (
                product.seo_description
                or product.short_description
                or ''
            )
            description = raw_desc[:160].strip()

            return {
                'title':       full_title,
                'description': description,
                'keywords':    product.seo_keywords or '',
                'image':       _abs_media(request, product.image),
                'url':         request.build_absolute_uri(request.path),
            }
        except Exception:
            return None

    # ── Fetch blog SEO data ────────────────────────────────
    def _blog_meta(self, request, slug: str) -> dict | None:
        try:
            from shop.models import BlogPost, SiteSettings
            post = BlogPost.objects.only(
                'title', 'slug', 'seo_title', 'seo_description',
                'seo_keywords', 'image'
            ).get(slug=slug, is_published=True)

            site = SiteSettings.objects.only('site_title').first()
            site_title = site.site_title if site else 'Qbamart'

            title = (post.seo_title or post.title).strip()
            full_title = f'{title} | {site_title}'

            description = (post.seo_description or '').strip()[:160]

            return {
                'title':       full_title,
                'description': description,
                'keywords':    post.seo_keywords or '',
                'image':       _abs_media(request, post.image),
                'url':         request.build_absolute_uri(request.path),
            }
        except Exception:
            return None

    # ── Main handler ───────────────────────────────────────
    def get(self, request, *args, **kwargs):
        html = self._get_raw_html()
        path = request.path

        meta = None

        m = self.PRODUCT_RE.match(path)
        if m:
            meta = self._product_meta(request, m.group('slug'))

        if meta is None:
            m = self.BLOG_RE.match(path)
            if m:
                meta = self._blog_meta(request, m.group('slug'))

        if meta:
            html = self._inject_meta(html, meta)

        return HttpResponse(html, content_type='text/html; charset=utf-8')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),
    path('sitemap.xml', SitemapView.as_view(), name='sitemap'),
    path('sitemap.xsl', SitemapXslView.as_view(), name='sitemap-xsl'),

    # Catch-all: serve the React SPA with dynamic SEO injection
    re_path(r'^(?!api/|admin/|static/|media/|sitemap).*$', IndexView.as_view(), name='index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

