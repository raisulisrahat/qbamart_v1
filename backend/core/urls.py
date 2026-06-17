from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from shop.views import SitemapView, SitemapXslView
from django.views import View
from django.http import HttpResponse
import os


class IndexView(View):
    """
    Serves the built Vite index.html with the GTM snippet injected
    dynamically from SiteSettings. This ensures the GTM ID managed via
    the Staff Settings page is always present in the raw HTML source,
    making it detectable by Google Tag Assistant and crawlers.
    """

    _cached_template: str | None = None
    _cached_mtime: float | None = None

    @classmethod
    def _get_template(cls) -> str:
        index_path = os.path.join(settings.FRONTEND_DIST_DIR, 'index.html')
        try:
            mtime = os.path.getmtime(index_path)
        except FileNotFoundError:
            return '<html><body><p>Frontend not built yet. Run <code>npm run build</code>.</p></body></html>'

        # Simple file-level cache: re-read only when the file changes on disk
        if cls._cached_mtime != mtime:
            with open(index_path, 'r', encoding='utf-8') as f:
                cls._cached_template = f.read()
            cls._cached_mtime = mtime
        return cls._cached_template  # type: ignore[return-value]

    def get(self, request, *args, **kwargs):
        html = self._get_template()

        # Fetch GTM ID from SiteSettings (single row)
        try:
            from shop.models import SiteSettings
            site_settings = SiteSettings.objects.only('google_tag_manager_id').first()
            gtm_id = (site_settings.google_tag_manager_id or '').strip() if site_settings else ''
        except Exception:
            gtm_id = ''

        if gtm_id:
            gtm_snippet = (
                f'<!-- Google Tag Manager -->\n'
                f'    <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{"gtm.start":\n'
                f'    new Date().getTime(),event:"gtm.js"}});var f=d.getElementsByTagName(s)[0],\n'
                f'    j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=\n'
                f'    "https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);\n'
                f'    }})(window,document,"script","dataLayer","{gtm_id}");</script>\n'
                f'    <!-- End Google Tag Manager -->'
            )
            gtm_noscript = (
                f'<!-- Google Tag Manager (noscript) -->\n'
                f'    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={gtm_id}"\n'
                f'    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n'
                f'    <!-- End Google Tag Manager (noscript) -->'
            )
        else:
            gtm_snippet = ''
            gtm_noscript = ''

        html = html.replace('__GTM_SNIPPET__', gtm_snippet)
        html = html.replace('__GTM_NOSCRIPT__', gtm_noscript)

        return HttpResponse(html, content_type='text/html; charset=utf-8')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),
    path('sitemap.xml', SitemapView.as_view(), name='sitemap'),
    path('sitemap.xsl', SitemapXslView.as_view(), name='sitemap-xsl'),

    # Catch-all: serve the React SPA with GTM injected from SiteSettings
    re_path(r'^(?!api/|admin/|static/|media/|sitemap).*$', IndexView.as_view(), name='index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

