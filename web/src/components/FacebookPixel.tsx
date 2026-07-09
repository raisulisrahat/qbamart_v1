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
            n = f.fbq = function () {
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

        (window as any).fbq('init', pixelId);
        isInitialized.current = true;
    }, [pixelId]);

    // Fire PageView on route change with unique eventID for deduplication
    useEffect(() => {
        if (!pixelId) return;
        const f = window as any;
        if (f.fbq) {
            const eventId = generateEventId();
            
            // Format exactly like PixelYourSite
            const customData = {
                page_title: document.title || 'Shop',
                post_type: 'page',
                plugin: 'PixelYourSite',
                user_role: 'guest',
                event_url: window.location.host + window.location.pathname
            };

            f.fbq('track', 'PageView', customData, { eventID: eventId });

            // Also push to GTM for unified CAPI deduplication
            const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: 'page_view',
                event_id: eventId,
                page_path: location.pathname,
                ...customData
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
