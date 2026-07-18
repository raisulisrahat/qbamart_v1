import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { resolveImageUrl } from '../utils/image';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  schema?: any;
  noIndex?: boolean;
}

const SEO = ({ title, description, image, url, type = 'website', keywords, schema, noIndex = false }: SEOProps) => {
  const { siteTitle, settings, pageSeoList } = useSettings();
  const location = useLocation();

  // ── Look up PageSeo record for the current path ────────────
  // Values from SEO Manager (Pages tab) take priority over hardcoded props.
  // Product/blog pages pass explicit props so they always win.
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  const pageSeo = pageSeoList.find(p => {
    const p2 = (p.page_path || '').replace(/\/$/, '') || '/';
    return p2 === currentPath;
  });

  // Priority: pageSeo (from DB) > prop passed by page > global SiteSettings fallback
  const baseTitle = siteTitle;

  const finalTitle = pageSeo?.seo_title || title
    ? `${pageSeo?.seo_title || title} | ${baseTitle}`
    : baseTitle;

  const finalDesc = pageSeo?.seo_description
    || description
    || settings?.meta_description
    || `${baseTitle} - Premium Shopping in Bangladesh`;

  const finalKeywords = pageSeo?.seo_keywords
    || keywords
    || settings?.meta_keywords
    || `ecommerce, bangladesh, shopping, ${baseTitle}`;

  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const ogImage = image
    ? resolveImageUrl(image)
    : settings?.site_logo
    ? resolveImageUrl(settings.site_logo)
    : '';

  // JSON-LD structured data
  let siteUrl = (settings as any)?.site_url 
    || (typeof window !== 'undefined' ? window.location.origin : 'https://qbamart.com');
  if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
    siteUrl = `https://${siteUrl}`;
  }

  const finalSchema = schema || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: baseTitle,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl.replace(/\/$/, '')}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* Primary */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={baseTitle} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={baseTitle} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:type" content="image/png" />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      {ogImage && <meta property="og:image:alt" content={finalTitle} />}
      <meta property="fb:app_id" content={settings?.facebook_app_id} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};

export default SEO;
