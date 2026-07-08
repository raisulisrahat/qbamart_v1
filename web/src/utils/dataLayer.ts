// src/utils/dataLayer.ts

let lastEventStr = '';
let lastEventTime = 0;

export const pushToDataLayer = (data: any) => {
    // Deduplicate in React Strict Mode or duplicate calls within 1s
    const now = Date.now();
    const eventStr = JSON.stringify(data);
    
    if (now - lastEventTime < 1000 && eventStr === lastEventStr) {
        return; // Suppress duplicate
    }
    
    lastEventStr = eventStr;
    lastEventTime = now;

    // Ensure dataLayer exists
    const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    
    // Clear the previous ecommerce object to prevent data bleeding between events
    if (data.ecommerce) {
        dataLayer.push({ ecommerce: null });
    }
    
    // Push the new event
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