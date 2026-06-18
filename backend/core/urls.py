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
#  Always uses MEDIA_DOMAIN (api.qbamart.com) since media
#  files are served by the API server, not the frontend.
# ─────────────────────────────────────────────
def _abs_media(image_field) -> str:
    """Return an absolute URL for a model ImageField using MEDIA_DOMAIN."""
    if not image_field:
        return ''
    try:
        media_domain = getattr(settings, 'MEDIA_DOMAIN', 'https://api.qbamart.com').rstrip('/')
        relative = image_field.url  # e.g. /media/products/foo.webp
        return f"{media_domain}{relative}"
    except Exception:
        return ''


# ─────────────────────────────────────────────
#  Helper: build the frontend page URL
#  Always uses SITE_URL (qbamart.com) — NOT the API domain.
# ─────────────────────────────────────────────
def _frontend_url(path: str) -> str:
    """Return an absolute frontend URL for a given path."""
    site_url = getattr(settings, 'SITE_URL', 'https://qbamart.com').rstrip('/')
    return f"{site_url}{path}"


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

    For /product/<slug>, /blog/<slug>, and configured static pages,
    it fetches SEO metadata from the database and INSERTS the meta tags
    before </head>. index.html has NO static default meta tags.

    og:url / canonical always use SITE_URL (qbamart.com).
    og:image tags always use MEDIA_DOMAIN (api.qbamart.com).
    Products emit multiple og:image tags (one per gallery image) for
    Facebook/LinkedIn carousel previews.
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
        Insert a full SEO block directly before </head>.
        meta dict keys:
          title, desc, keywords, url (frontend URL), image (primary),
          images (list of all gallery image URLs for og:image carousel)
        """
        title    = _esc(meta.get('title', ''))
        desc     = _esc(meta.get('description', ''))
        url      = _esc(meta.get('url', ''))
        keywords = _esc(meta.get('keywords', ''))
        # images: list of absolute URLs; first is primary
        images   = [_esc(img) for img in meta.get('images', []) if img]
        # Fall back to legacy single 'image' key
        if not images and meta.get('image'):
            images = [_esc(meta['image'])]

        lines = [
            f'  <title>{title}</title>',
            f'  <meta name="description" content="{desc}" />',
            f'  <meta name="robots" content="index, follow" />',
        ]
        if keywords:
            lines.append(f'  <meta name="keywords" content="{keywords}" />')
        if url:
            lines.append(f'  <link rel="canonical" href="{url}" />')

        # Open Graph
        lines += [
            f'  <meta property="og:type" content="website" />',
            f'  <meta property="og:site_name" content="Qbamart" />',
            f'  <meta property="og:title" content="{title}" />',
            f'  <meta property="og:description" content="{desc}" />',
            f'  <meta property="og:url" content="{url}" />',
        ]
        # Emit one og:image tag per gallery image (carousel support)
        for img_url in images:
            lines += [
                f'  <meta property="og:image" content="{img_url}" />',
                f'  <meta property="og:image:width" content="1200" />',
                f'  <meta property="og:image:height" content="630" />',
                f'  <meta property="og:image:alt" content="{title}" />',
            ]

        # Twitter — use first image only
        primary_image = images[0] if images else ''
        lines += [
            f'  <meta name="twitter:card" content="summary_large_image" />',
            f'  <meta name="twitter:title" content="{title}" />',
            f'  <meta name="twitter:description" content="{desc}" />',
        ]
        if primary_image:
            lines.append(f'  <meta name="twitter:image" content="{primary_image}" />')

        block = '\n'.join(lines) + '\n'
        return html.replace('</head>', block + '</head>', 1)

    # ── Fetch product SEO data ─────────────────────────────
    def _product_meta(self, request, slug: str) -> dict | None:
        try:
            from shop.models import Product, SiteSettings
            product = (
                Product.objects
                .prefetch_related('images')
                .only('name', 'slug', 'seo_title', 'seo_description',
                      'seo_keywords', 'short_description', 'image')
                .get(slug=slug, is_active=True)
            )

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

            # Build image list: main image first, then gallery images
            all_images = []
            if product.image:
                all_images.append(_abs_media(product.image))
            for gallery_img in product.images.all():
                url = _abs_media(gallery_img.image)
                if url and url not in all_images:
                    all_images.append(url)

            return {
                'title':       full_title,
                'description': description,
                'keywords':    product.seo_keywords or '',
                'images':      all_images,
                'url':         _frontend_url(request.path),
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

            images = [_abs_media(post.image)] if post.image else []

            return {
                'title':       full_title,
                'description': description,
                'keywords':    post.seo_keywords or '',
                'images':      images,
                'url':         _frontend_url(request.path),
            }
        except Exception:
            return None

    # ── Fetch static page SEO data ─────────────────────────
    def _page_meta(self, request, path: str) -> dict | None:
        try:
            from shop.models import PageSeo, SiteSettings
            page = PageSeo.objects.only(
                'seo_title', 'seo_description', 'seo_keywords', 'page_label', 'page_path'
            ).get(page_path=path)

            if not (page.seo_title or page.seo_description or page.seo_keywords):
                return None  # No custom SEO set yet

            site = SiteSettings.objects.only('site_title').first()
            site_title = site.site_title if site else 'Qbamart'

            title = page.seo_title.strip() if page.seo_title else page.page_label
            full_title = f'{title} | {site_title}'
            description = (page.seo_description or '').strip()[:160]

            return {
                'title':       full_title,
                'description': description,
                'keywords':    page.seo_keywords or '',
                'images':      [],
                'url':         _frontend_url(request.path),
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

        # Static page SEO (home, /products, /about-us, etc.)
        if meta is None:
            meta = self._page_meta(request, path)

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
