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

        // Initialize Facebook Pixel
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

        // Monkey-patch to deduplicate fbq calls
        const patchFbq = () => {
            const f = window as any;
            if (f.fbq && !f.fbq.isPatched) {
                const originalFbq = f.fbq;
                const newFbq = function() {
                    const args = Array.from(arguments);
                    const isTrack = args[0] === 'track' || args[0] === 'trackSingle';
                    
                    if (isTrack) {
                        const eventName = args[0] === 'track' ? args[1] : args[2];
                        const eventId = args[0] === 'track' ? args[2]?.eventID : args[3]?.eventID;
                        
                        const key = `${args[0]}_${eventName}_${window.location.pathname}_${eventId || ''}`;
                        if (!f._fbq_dedupe) f._fbq_dedupe = {};
                        
                        const now = Date.now();
                        const lastTime = f._fbq_dedupe[key] || 0;
                        
                        // For PageView, NEVER fire again on the same path
                        if (eventName === 'PageView' && lastTime > 0) {
                            return;
                        }
                        
                        // For other events, suppress if fired within last 2 seconds (2000ms)
                        if (now - lastTime < 2000) {
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
                
                // Copy properties over
                Object.keys(originalFbq).forEach(key => {
                    newFbq[key] = originalFbq[key];
                });
                
                f.fbq = newFbq;
                f._fbq = newFbq;
            }
        };

        patchFbq();

        (window as any).fbq('init', pixelId);
        (window as any).fbq('track', 'PageView');
    }, [pixelId]);

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
