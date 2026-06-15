import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const GoogleTagManager = () => {
    const { settings } = useSettings();
    const gtmId = settings?.google_tag_manager_id;

    useEffect(() => {
        if (!gtmId) return;

        // Ensure dataLayer is initialized
        (window as any).dataLayer = (window as any).dataLayer || [];

        // 1. Inject the GTM script in document head
        const scriptId = 'gtm-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
            `;
            document.head.appendChild(script);
        }

        // 2. Inject the noscript iframe in document body
        const noscriptId = 'gtm-noscript';
        if (!document.getElementById(noscriptId)) {
            const noscript = document.createElement('noscript');
            noscript.id = noscriptId;
            noscript.innerHTML = `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `;
            document.body.insertBefore(noscript, document.body.firstChild);
        }
    }, [gtmId]);

    return null;
};

export default GoogleTagManager;
