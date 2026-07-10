import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface PixelProps {
    pixelId?: string;
}

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

        // 2. Patched fbq to filter out duplicate commands
        const createPatchedFbq = (original: any) => {
            const patched = function(...args: any[]) {
                const command = args[0];
                const eventName = args[0] === 'trackSingle' ? args[2] : args[1];
                
                if ((command === 'track' || command === 'trackSingle') && eventName === 'InitiateCheckout') {
                    if ((window as any).__blocked_duplicate_fb_initiate_checkout) {
                        console.log('Blocked duplicate InitiateCheckout from external source');
                        return;
                    }
                    (window as any).__blocked_duplicate_fb_initiate_checkout = true;
                }
                
                if ((command === 'track' || command === 'trackSingle') && eventName === 'Purchase') {
                    if ((window as any).__blocked_duplicate_fb_purchase) {
                        console.log('Blocked duplicate Purchase from external source');
                        return;
                    }
                    (window as any).__blocked_duplicate_fb_purchase = true;
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
                (window as any).fbq('trackSingle', targetPixelId, 'ViewContent', {
                    content_name: item.item_name,
                    content_category: item.item_category,
                    content_ids: [String(item.item_id || item.id)],
                    content_type: 'product',
                    value: parseFloat(item.price) || 0,
                    currency: data.ecommerce.currency || 'BDT'
                });
            }

            // InitiateCheckout
            if (event === 'begin_checkout' && data.ecommerce) {
                const items = data.ecommerce.items || [];
                const contentIds = items.map((item: any) => String(item.item_id || item.id));
                const numItems = items.reduce((sum: number, item: any) => sum + (parseInt(item.quantity) || 1), 0);
                (window as any).fbq('trackSingle', targetPixelId, 'InitiateCheckout', {
                    content_ids: contentIds,
                    content_type: 'product',
                    value: parseFloat(data.ecommerce.value) || 0,
                    currency: data.ecommerce.currency || 'BDT',
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
                
                (window as any).fbq('trackSingle', targetPixelId, 'Purchase', {
                    content_ids: contentIds,
                    content_type: 'product',
                    value: parseFloat(data.ecommerce.value) || 0,
                    currency: data.ecommerce.currency || 'BDT',
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
