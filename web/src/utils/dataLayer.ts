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