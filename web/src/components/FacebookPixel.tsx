import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface PixelProps {
    pixelId?: string;
}

const cleanAndParseFloat = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

const sanitizeEventOptions = (options: any, eventName: string) => {
    if (!options || typeof options !== 'object') return;
    
    // Clean value
    if ('value' in options) {
        let valueNum = cleanAndParseFloat(options.value);
        if (valueNum <= 0) {
            valueNum = 1; // Default to 1 to prevent Meta Pixel errors
        }
        options.value = valueNum;
    } else if (eventName === 'Purchase') {
        options.value = 1;
    }
    
    // Clean currency
    if ('currency' in options) {
        const rawCurrency = options.currency;
        const currencyClean = String(rawCurrency).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'BDT';
        options.currency = currencyClean;
    } else if (eventName === 'Purchase') {
        options.currency = 'BDT';
    }
};

const FacebookPixel = ({ pixelId: customPixelId }: PixelProps) => {
    const { settings } = useSettings();
    const pixelId = customPixelId || settings?.facebook_pixel_id;

    useEffect(() => {
        if (!pixelId || settings?.enable_facebook_pixel === false) return;

        const isGlobalPixel = !customPixelId || customPixelId === settings?.facebook_pixel_id;
        const isGtmActive = settings?.enable_google_tag_manager === true;
        const shouldInitializeNatively = !isGlobalPixel || !isGtmActive;

        // 1. Stub/Queue Initialization
        // Define the fbq stub on window if it doesn't exist yet
        let currentFbq = (window as any).fbq;
        if (!currentFbq) {
            currentFbq = function(...args: any[]) {
                if (currentFbq.callMethod) {
                    currentFbq.callMethod.apply(currentFbq, args);
                } else {
                    currentFbq.queue.push(args);
                }
            };
            currentFbq.push = currentFbq;
            currentFbq.loaded = true;
            currentFbq.version = '2.0';
            currentFbq.queue = [];
            (window as any).fbq = currentFbq;
        }

        // 2. Patched fbq to filter out duplicate commands and sanitize event properties
        const createPatchedFbq = (original: any) => {
            const patched = function(...args: any[]) {
                const command = args[0];
                const eventName = args[0] === 'trackSingle' ? args[2] : args[1];
                const optionsIdx = args[0] === 'trackSingle' ? 3 : 2;
                
                if (command === 'track' || command === 'trackSingle') {
                    const allowedEvents = ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'];
                    if (!allowedEvents.includes(eventName)) {
                        console.log(`Blocked non-allowed event: ${eventName}`);
                        return;
                    }

                    if (eventName === 'Purchase' || eventName === 'InitiateCheckout' || eventName === 'ViewContent') {
                        if (!args[optionsIdx] || typeof args[optionsIdx] !== 'object') {
                            args[optionsIdx] = {};
                        }
                        sanitizeEventOptions(args[optionsIdx], eventName);
                    }
                }
                
                if ((command === 'track' || command === 'trackSingle') && eventName === 'InitiateCheckout') {
                    const now = Date.now();
                    if ((window as any).__last_fb_initiate_checkout && (now - (window as any).__last_fb_initiate_checkout) < 2000) {
                        console.log('Blocked duplicate InitiateCheckout within 2s');
                        return;
                    }
                    (window as any).__last_fb_initiate_checkout = now;
                }
                
                if ((command === 'track' || command === 'trackSingle') && eventName === 'Purchase') {
                    const now = Date.now();
                    if ((window as any).__last_fb_purchase && (now - (window as any).__last_fb_purchase) < 2000) {
                        console.log('Blocked duplicate Purchase within 2s');
                        return;
                    }
                    (window as any).__last_fb_purchase = now;
                }

                // Debounce PageView to prevent GTM templates and native code from firing 3-4 times at once
                if ((command === 'track' || command === 'trackSingle') && eventName === 'PageView') {
                    const now = Date.now();
                    if ((window as any).__last_fb_pageview && (now - (window as any).__last_fb_pageview) < 1500) {
                        console.log('Blocked simultaneous duplicate PageView from GTM/Native overlap');
                        return;
                    }
                    (window as any).__last_fb_pageview = now;
                }
                
                if (original.callMethod) {
                    original.callMethod.apply(original, args);
                } else if (original.queue) {
                    original.queue.push(args);
                } else {
                    original.apply(null, args);
                }
            };
            
            // Preserve properties
            Object.assign(patched, original);
            return patched;
        };

        let activeFbq = createPatchedFbq(currentFbq);

        Object.defineProperty(window, 'fbq', {
            get: () => activeFbq,
            set: (newVal) => {
                // When fbevents.js loads, it sets window.fbq to a new function.
                // We wrap the new function to keep our patch intact!
                activeFbq = createPatchedFbq(newVal);
            },
            configurable: true
        });

        // 3. Dynamic Script Injection (Only if we should track natively or script is missing)
        if (shouldInitializeNatively) {
            let scriptTag = document.getElementById('facebook-pixel-script') || document.querySelector('script[src*="fbevents.js"]');
            if (!scriptTag) {
                scriptTag = document.createElement('script');
                scriptTag.id = 'facebook-pixel-script';
                (scriptTag as HTMLScriptElement).async = true;
                (scriptTag as HTMLScriptElement).src = 'https://connect.facebook.net/en_US/fbevents.js';
                const firstScript = document.getElementsByTagName('script')[0];
                if (firstScript && firstScript.parentNode) {
                    firstScript.parentNode.insertBefore(scriptTag, firstScript);
                } else {
                    document.head.appendChild(scriptTag);
                }
            }
            
            // Call fbq init
            (window as any).fbq('init', pixelId);
        }

        // 4. Map GTM dataLayer events to native calls
        const mapDataLayerToFbq = (data: any, targetPixelId: string) => {
            if (!data || !data.event) return;

            const event = data.event;
            
            // PageView
            if (event === 'page_view') {
                (window as any).fbq('trackSingle', targetPixelId, 'PageView');
            }

            // ViewContent
            if (event === 'view_item' && data.ecommerce?.items?.[0]) {
                const item = data.ecommerce.items[0];
                const itemPrice = cleanAndParseFloat(item.price);
                const rawCurrency = data.ecommerce.currency ?? data.currency ?? 'BDT';
                const currencyClean = String(rawCurrency).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'BDT';
                (window as any).fbq('trackSingle', targetPixelId, 'ViewContent', {
                    content_name: item.item_name,
                    content_category: item.item_category,
                    content_ids: [String(item.item_id || item.id)],
                    content_type: 'product',
                    value: itemPrice,
                    currency: currencyClean
                });
            }

            // AddToCart
            if ((event === 'add_to_cart' || event === 'order_now') && data.ecommerce) {
                const items = data.ecommerce.items || [];
                const contentIds = items.map((item: any) => String(item.item_id || item.id));
                const rawValue = data.ecommerce.value ?? data.value;
                let valueNum = cleanAndParseFloat(rawValue);
                if (valueNum <= 0) {
                    const itemsSum = items.reduce((sum: number, item: any) => {
                        const itemPrice = cleanAndParseFloat(item.price);
                        const itemQty = parseInt(item.quantity) || 1;
                        return sum + (itemPrice * itemQty);
                    }, 0);
                    if (itemsSum > 0) {
                        valueNum = itemsSum;
                    }
                }
                if (valueNum <= 0) {
                    valueNum = 1;
                }

                const rawCurrency = data.ecommerce.currency ?? data.currency ?? 'BDT';
                const currencyClean = String(rawCurrency).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'BDT';

                (window as any).fbq('trackSingle', targetPixelId, 'AddToCart', {
                    content_ids: contentIds,
                    content_type: 'product',
                    value: valueNum,
                    currency: currencyClean
                });
            }

            // InitiateCheckout
            if (event === 'begin_checkout' && data.ecommerce) {
                const items = data.ecommerce.items || [];
                const contentIds = items.map((item: any) => String(item.item_id || item.id));
                const numItems = items.reduce((sum: number, item: any) => sum + (parseInt(item.quantity) || 1), 0);
                
                const rawValue = data.ecommerce.value ?? data.total_amount ?? data.value;
                let valueNum = cleanAndParseFloat(rawValue);
                if (valueNum <= 0) {
                    const itemsSum = items.reduce((sum: number, item: any) => {
                        const itemPrice = cleanAndParseFloat(item.price);
                        const itemQty = parseInt(item.quantity) || 1;
                        return sum + (itemPrice * itemQty);
                    }, 0);
                    if (itemsSum > 0) {
                        valueNum = itemsSum;
                    }
                }
                if (valueNum <= 0) {
                    valueNum = 1;
                }

                const rawCurrency = data.ecommerce.currency ?? data.currency ?? 'BDT';
                const currencyClean = String(rawCurrency).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'BDT';

                (window as any).fbq('trackSingle', targetPixelId, 'InitiateCheckout', {
                    content_ids: contentIds,
                    content_type: 'product',
                    value: valueNum,
                    currency: currencyClean,
                    num_items: numItems
                });
            }

            // Purchase
            if (event === 'purchase' && data.ecommerce) {
                const items = data.ecommerce.items || [];
                const contentIds = items.map((item: any) => String(item.item_id || item.id));
                const numItems = items.reduce((sum: number, item: any) => sum + (parseInt(item.quantity) || 1), 0);
                
                const options: any = {};
                if (data.event_id) {
                    options.eventID = data.event_id;
                }
                
                const rawValue = data.ecommerce.value ?? data.total_amount ?? data.value;
                let valueNum = cleanAndParseFloat(rawValue);
                if (valueNum <= 0) {
                    const itemsSum = items.reduce((sum: number, item: any) => {
                        const itemPrice = cleanAndParseFloat(item.price);
                        const itemQty = parseInt(item.quantity) || 1;
                        return sum + (itemPrice * itemQty);
                    }, 0);
                    if (itemsSum > 0) {
                        valueNum = itemsSum;
                    }
                }
                if (valueNum <= 0) {
                    valueNum = 1;
                }

                const rawCurrency = data.ecommerce.currency ?? data.currency ?? 'BDT';
                const currencyClean = String(rawCurrency).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'BDT';
                
                (window as any).fbq('trackSingle', targetPixelId, 'Purchase', {
                    content_ids: contentIds,
                    content_type: 'product',
                    value: valueNum,
                    currency: currencyClean,
                    num_items: numItems,
                    transaction_id: data.ecommerce.transaction_id || data.order_id
                }, options);
            }
        };

        const processEvent = (eventData: any) => {
            if (!eventData || typeof eventData !== 'object' || !eventData.event) return;
            
            const eventId = eventData.event_id || `${eventData.event}_${JSON.stringify(eventData.ecommerce || {})}`;
            const processedKey = `__processed_${pixelId}_${eventId}`;
            
            if ((window as any)[processedKey]) {
                return;
            }
            (window as any)[processedKey] = true;
            
            mapDataLayerToFbq(eventData, pixelId);
        };

        // Listen for new dataLayer pushes via custom event
        const handlePush = (e: Event) => {
            const eventData = (e as CustomEvent).detail;
            if (shouldInitializeNatively) {
                processEvent(eventData);
            }
        };

        window.addEventListener('dataLayerPush', handlePush);

        // Process any existing dataLayer events
        const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
        
        // Patch dataLayer.push if not already done
        if (!(window as any).__gtm_push_patched) {
            (window as any).__gtm_push_patched = true;
            const originalPush = dataLayer.push;
            dataLayer.push = function(...args: any[]) {
                const result = originalPush.apply(this, args);
                const eventData = args[0];
                if (eventData && typeof eventData === 'object') {
                    const event = new CustomEvent('dataLayerPush', { detail: eventData });
                    window.dispatchEvent(event);
                }
                return result;
            };
        }

        if (shouldInitializeNatively) {
            dataLayer.forEach((eventData: any) => {
                processEvent(eventData);
            });
        }

        return () => {
            window.removeEventListener('dataLayerPush', handlePush);
        };

    }, [pixelId, customPixelId, settings]);

    return null;
};

export default FacebookPixel;
