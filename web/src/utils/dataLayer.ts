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