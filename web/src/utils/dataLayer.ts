// src/utils/dataLayer.ts

let lastEventStr = '';
let lastEventTime = 0;

export const generateEventId = () => {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const pushToDataLayer = (data: any) => {
    // Deduplicate in React Strict Mode or duplicate calls within 1s
    const now = Date.now();
    // Exclude dynamically changing properties like timestamps from deduplication check
    const { event_id, ...dedupeData } = data;
    const eventStr = JSON.stringify(dedupeData);
    
    if (now - lastEventTime < 1000 && eventStr === lastEventStr) {
        return; // Suppress duplicate
    }
    
    lastEventStr = eventStr;
    lastEventTime = now;

    // Generate unified event ID for deduplication across platforms (PixelYourSite style)
    const eventId = generateEventId();
    data.event_id = eventId;

    // 1. Push to GTM DataLayer
    const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    
    if (data.ecommerce) {
        dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
    }
    
    dataLayer.push(data);

    // 2. Push natively to Meta Pixel (fbq) with deduplication ID
    // This replicates PixelYourSite's robust direct tracking combined with CAPI/GTM deduplication
    const f = window as any;
    if (f.fbq) {
        let metaEventName = '';
        let metaData: any = {};

        switch (data.event) {
            case 'view_item':
                metaEventName = 'ViewContent';
                metaData = {
                    content_ids: data.ecommerce?.items?.map((i: any) => i.item_id?.toString()) || [],
                    content_name: data.ecommerce?.items?.[0]?.item_name,
                    content_type: 'product',
                    value: data.ecommerce?.value,
                    currency: data.ecommerce?.currency || 'BDT',
                };
                break;
            case 'add_to_cart':
                metaEventName = 'AddToCart';
                metaData = {
                    content_ids: data.ecommerce?.items?.map((i: any) => i.item_id?.toString()) || [],
                    content_name: data.ecommerce?.items?.[0]?.item_name,
                    content_type: 'product',
                    value: data.ecommerce?.value,
                    currency: data.ecommerce?.currency || 'BDT',
                };
                break;
            case 'begin_checkout':
                metaEventName = 'InitiateCheckout';
                metaData = {
                    content_ids: data.ecommerce?.items?.map((i: any) => i.item_id?.toString()) || [],
                    content_type: 'product',
                    value: data.ecommerce?.value,
                    currency: data.ecommerce?.currency || 'BDT',
                    num_items: data.ecommerce?.items?.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) || 1
                };
                break;
            case 'purchase':
                metaEventName = 'Purchase';
                metaData = {
                    content_ids: data.ecommerce?.items?.map((i: any) => i.item_id?.toString()) || [],
                    content_type: 'product',
                    value: data.ecommerce?.value,
                    currency: data.ecommerce?.currency || 'BDT',
                    num_items: data.quantity || 1,
                    order_id: data.order_id
                };
                break;
            default:
                // Ignore generic custom events unless specifically needed
                break;
        }

        if (metaEventName) {
            f.fbq('track', metaEventName, metaData, { eventID: eventId });
        }
    }
};

export const splitName = (fullName: string) => {
  const name = (fullName || '').trim();
  if (!name) {
    return { first_name: '', last_name: '' };
  }
  const parts = name.split(/\s+/);
  if (parts.length === 1) {
    return {
      first_name: parts[0],
      last_name: ''
    };
  }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' ')
  };
};