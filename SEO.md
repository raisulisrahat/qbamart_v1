# SEO Code List and Implementation Paths

This document outlines the standard SEO tags, where they should be implemented, and code examples for your tech stack.

## 1. Global Meta Tags (Base SEO)
**Path:** `web/index.html` (If using React/Vite) or `backend/core/templates/base.html` (If using Django templates)

These are the default tags that load with your application.

```html
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QbaMart - Your Premium E-commerce Destination</title>
    <meta name="description" content="Shop the best products at QbaMart. Fast delivery, secure payments, and premium quality." />
    <meta name="keywords" content="qbamart, ecommerce, online shopping" />
    
    <!-- Open Graph (Facebook/Meta) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="QbaMart - Your Premium E-commerce Destination" />
    <meta property="og:description" content="Shop the best products at QbaMart. Fast delivery, secure payments, and premium quality." />
    <meta property="og:image" content="https://www.qbamart.com/og-image.jpg" />
    <meta property="og:url" content="https://www.qbamart.com" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="QbaMart - Your Premium E-commerce Destination" />
    <meta name="twitter:description" content="Shop the best products at QbaMart." />
    <meta name="twitter:image" content="https://www.qbamart.com/twitter-image.jpg" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.qbamart.com" />
</head>
```

## 2. Dynamic SEO for React Components (using React Helmet)
**Path:** `web/src/components/SEO.tsx` (Create a reusable SEO component)

If you are rendering the frontend using React (Vite/CRA), use a library like `react-helmet-async` to dynamically inject meta tags based on the current page.

```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export default function SEO({ title, description, url, image }: SEOProps) {
  const siteUrl = 'https://www.qbamart.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image || `${siteUrl}/default-og-image.jpg`;

  return (
    <Helmet>
      <title>{title} | QbaMart</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
```

## 3. Product Page SEO (Dynamic Content)
**Path:** `web/src/pages/ProductDetails.tsx`

Implement the `SEO` component on dynamic pages like product details to use data from the backend.

```tsx
import SEO from '../components/SEO';

// Inside your Product component...
return (
  <>
    <SEO 
      title={product.name} 
      description={product.shortDescription} 
      url={`/product/${product.slug}`}
      image={product.imageUrl}
    />
    <div className="product-details">
      {/* Product Content */}
    </div>
  </>
);
```

## 4. Structured Data (JSON-LD) for Products
**Path:** `web/src/pages/ProductDetails.tsx` (or within your SEO component)

Google uses structured data to show rich snippets (like price, reviews, and availability in search results).

```tsx
const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.imageUrl,
  "description": product.description,
  "sku": product.sku,
  "offers": {
    "@type": "Offer",
    "url": `https://www.qbamart.com/product/${product.slug}`,
    "priceCurrency": "BDT",
    "price": product.price,
    "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  }
};

return (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(productSchema)}
    </script>
  </Helmet>
);
```

## 5. `robots.txt`
**Path:** `web/public/robots.txt`

Tells search engines which pages they can and cannot crawl.

```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/

Sitemap: https://www.qbamart.com/sitemap.xml
```

## 6. `sitemap.xml` Generation (Backend)
**Path:** `backend/core/urls.py` & `backend/core/sitemaps.py`

If you are using Django to serve the sitemap, use Django's sitemap framework.

**`backend/core/sitemaps.py`**
```python
from django.contrib.sitemaps import Sitemap
from shop.models import Product

class ProductSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return Product.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at
```

**`backend/core/urls.py`**
```python
from django.contrib.sitemaps.views import sitemap
from .sitemaps import ProductSitemap

sitemaps = {
    'products': ProductSitemap,
}

urlpatterns = [
    # ... your other urls
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]
```
