import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';
import { generateEventId } from '../utils/dataLayer';

interface PixelProps {
    pixelId?: string;
}

const FacebookPixel = ({ pixelId: customPixelId }: PixelProps) => {
    const { settings } = useSettings();
    const location = useLocation();
    const pixelId = customPixelId || settings?.facebook_pixel_id;
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!pixelId || isInitialized.current) return;

        // Initialize Facebook Pixel exactly like PixelYourSite
        const fbScript = () => {
            const f = window as any;
            const b = document;
            const e = 'script';
            const v = 'https://connect.facebook.net/en_US/fbevents.js';
            let n: any, t: any, s: any;

            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        };

        fbScript();

        // Aggressive Deduplication to block GTM's duplicate triggers
        const patchFbq = () => {
            const f = window as any;
            if (f.fbq && !f.fbq.isPatched) {
                const originalFbq = f.fbq;
                const newFbq = function() {
                    const args = Array.from(arguments);
                    const isTrack = args[0] === 'track' || args[0] === 'trackSingle';
                    
                    if (isTrack) {
                        const eventName = args[0] === 'track' ? args[1] : args[2];
                        
                        // Ignore eventId in the key so GTM's events (which often lack eventID) are caught and deduplicated against our native events!
                        const key = `${args[0]}_${eventName}_${window.location.pathname}`;
                        if (!f._fbq_dedupe) f._fbq_dedupe = {};
                        
                        const now = Date.now();
                        const lastTime = f._fbq_dedupe[key] || 0;
                        
                        // For PageView, NEVER fire again on the same path
                        if (eventName === 'PageView' && lastTime > 0) {
                            console.warn(`[Pixel Deduplication] Blocked duplicate ${eventName}`);
                            return;
                        }
                        
                        // For other events (ViewContent, AddToCart, InitiateCheckout), suppress if fired within last 3 seconds
                        if (now - lastTime < 3000) {
                            console.warn(`[Pixel Deduplication] Blocked duplicate ${eventName}`);
                            return;
                        }
                        
                        f._fbq_dedupe[key] = now;
                    }
                    
                    if (originalFbq.callMethod) {
                        originalFbq.callMethod.apply(originalFbq, args);
                    } else if (originalFbq.queue) {
                        originalFbq.queue.push(args);
                    } else {
                        originalFbq.apply(f, args);
                    }
                };
                newFbq.isPatched = true;
                
                Object.keys(originalFbq).forEach(key => {
                    newFbq[key] = originalFbq[key];
                });
                
                f.fbq = newFbq;
                f._fbq = newFbq;
            }
        };

        patchFbq();

        (window as any).fbq('init', pixelId);
        isInitialized.current = true;
    }, [pixelId]);

    // Fire PageView on route change with unique eventID for deduplication
    useEffect(() => {
        if (!pixelId) return;
        const f = window as any;
        if (f.fbq) {
            const eventId = generateEventId();
            f.fbq('track', 'PageView', {}, { eventID: eventId });
            
            // Also push to GTM for unified CAPI deduplication
            const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: 'page_view',
                event_id: eventId,
                page_path: location.pathname
            });
        }
    }, [location.pathname, pixelId]);

    return (
        <noscript>
            <img 
                height="1" 
                width="1" 
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
            />
        </noscript>
    );
};

export default FacebookPixel;
