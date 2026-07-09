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

        // Invincible Deduplication Patch: Intercepts even when fbevents.js overwrites window.fbq
        const setupInvinciblePatch = () => {
            const f = window as any;
            if (f._invinciblePatchApplied) return;
            f._invinciblePatchApplied = true;

            let realFbq = f.fbq;

            const createWrappedFbq = (originalFbq: any) => {
                const wrapped = function() {
                    const args = Array.from(arguments);
                    const isTrack = args[0] === 'track' || args[0] === 'trackSingle';
                    
                    if (isTrack) {
                        const eventName = args[0] === 'track' ? args[1] : args[2];
                        const key = `${args[0]}_${eventName}_${window.location.pathname}`;
                        
                        if (!f._fbq_dedupe) f._fbq_dedupe = {};
                        const now = Date.now();
                        const lastTime = f._fbq_dedupe[key] || 0;
                        
                        // For PageView, NEVER fire again on the same path
                        if (eventName === 'PageView' && lastTime > 0) {
                            console.warn(`[Pixel] Blocked duplicate ${eventName}`);
                            return;
                        }
                        
                        // For other events, suppress if fired within last 3 seconds
                        if (now - lastTime < 3000) {
                            console.warn(`[Pixel] Blocked duplicate ${eventName}`);
                            return;
                        }
                        
                        f._fbq_dedupe[key] = now;
                    }
                    
                    if (originalFbq.callMethod) {
                        return originalFbq.callMethod.apply(originalFbq, args);
                    } else if (originalFbq.queue) {
                        originalFbq.queue.push(args);
                        return;
                    } else {
                        return originalFbq.apply(f, args);
                    }
                };
                
                Object.keys(originalFbq).forEach(k => {
                    (wrapped as any)[k] = originalFbq[k];
                });
                
                return wrapped;
            };

            // Wrap the initial stub
            if (realFbq) {
                realFbq = createWrappedFbq(realFbq);
            }

            // Intercept overwrites by fbevents.js
            Object.defineProperty(window, 'fbq', {
                get: () => realFbq,
                set: (newFbq) => {
                    realFbq = createWrappedFbq(newFbq);
                },
                configurable: true
            });
        };

        setupInvinciblePatch();

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
