import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';
import { resolveImageUrl } from '../utils/image';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  schema?: any; // For JSON-LD structured data
  noIndex?: boolean; // For private/account pages
}

const SEO = ({ title, description, image, url, type = 'website', keywords, schema, noIndex = false }: SEOProps) => {
  const { siteTitle, settings } = useSettings();

  const baseTitle = siteTitle || 'Qbamart';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const metaDesc = description || settings?.meta_description || `${baseTitle} - Premium Shopping in Bangladesh`;
  const metaKeywords = keywords || settings?.meta_keywords || `ecommerce, bangladesh, shopping, ${baseTitle}`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const ogImage = image
    ? resolveImageUrl(image)
    : settings?.site_logo
    ? resolveImageUrl(settings.site_logo)
    : '';

  // Build the JSON-LD schema
  const finalSchema = schema || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: baseTitle,
    url: typeof window !== 'undefined' ? window.location.origin : 'https://qbamart.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${typeof window !== 'undefined' ? window.location.origin : 'https://qbamart.com'}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={baseTitle} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={baseTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={title || baseTitle} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};

export default SEO;
