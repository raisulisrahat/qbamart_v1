import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface PixelProps {
    pixelId?: string;
}

const FacebookPixel = ({ pixelId: customPixelId }: PixelProps) => {
    const { settings } = useSettings();
    const pixelId = customPixelId || settings?.facebook_pixel_id;

    useEffect(() => {
        if (!pixelId) return;

        // GTM's "FB-BaseCode-Tag" is now responsible for initializing fbevents.js
        // and firing the initial PageView on all pages. 
        // We removed the native initialization and track('PageView') to stop duplicate PageViews.

        // MONKEY PATCH fbq to enforce strict single-fire for e-commerce events
        // Use Object.defineProperty to prevent fbevents.js from completely overwriting our patch
        let currentFbq = (window as any).fbq;
        
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

    }, [pixelId]);

    return null;
};

export default FacebookPixel;
