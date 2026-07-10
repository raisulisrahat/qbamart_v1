import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface GoogleTagProps {
    tagId?: string;
}

const GoogleTag = ({ tagId: customTagId }: GoogleTagProps) => {
    const { settings } = useSettings();
    const tagId = customTagId || settings?.google_tag_id;

    useEffect(() => {
        if (!tagId || settings?.enable_google_analytics === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Load gtag.js script
        const scriptId = 'google-tag-manager';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            
            // Use custom server container URL if enabled
            const baseUrl = (settings?.enable_server_container && settings?.server_container_url)
                ? settings.server_container_url.replace(/\/$/, '')
                : 'https://www.googletagmanager.com';
                
            script.src = `${baseUrl}/gtag/js?id=${tagId}`;
            document.head.appendChild(script);

            const inlineScript = document.createElement('script');
            inlineScript.id = 'google-tag-inline';
            
            // Construct options
            const configOptions: any = {
                first_party_collection: true
            };
            if (settings?.transport_url) {
                configOptions.transport_url = settings.transport_url;
            }
            
            inlineScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                if (!window.gtag) {
                    window.gtag = function(){window.dataLayer.push(arguments);}
                }
                var gtag = window.gtag;
                gtag('js', new Date());
                gtag('config', '${tagId}', ${JSON.stringify(configOptions)});
            `;
            document.head.appendChild(inlineScript);
        }
    }, [tagId, settings]);

    return null;
};

export default GoogleTag;
