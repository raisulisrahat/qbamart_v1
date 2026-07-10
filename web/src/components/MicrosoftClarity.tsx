import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const MicrosoftClarity = () => {
    const { settings } = useSettings();
    const clarityId = settings?.microsoft_clarity_project_id;

    useEffect(() => {
        if (!clarityId || settings?.enable_microsoft_clarity === false) return;

        // Initialize Microsoft Clarity script
        const scriptId = 'microsoft-clarity-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
            `;
            document.head.appendChild(script);
        }
    }, [clarityId, settings?.enable_microsoft_clarity]);

    return null;
};

export default MicrosoftClarity;
