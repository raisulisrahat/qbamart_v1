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
    Serves the built Vite index.html for all non-API routes, enabling
    React Router to handle client-side navigation correctly.
    GTM is embedded directly in index.html; the GoogleTagManager React
    component updates it dynamically from SiteSettings at runtime.
    """

    _cached_html: str | None = None
    _cached_mtime: float | None = None

    @classmethod
    def _get_html(cls) -> str:
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

    def get(self, request, *args, **kwargs):
        return HttpResponse(self._get_html(), content_type='text/html; charset=utf-8')


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

