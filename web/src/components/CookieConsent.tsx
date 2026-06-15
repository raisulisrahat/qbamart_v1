import { useState, useEffect } from 'react';

interface ConsentSettings {
    ad_storage: boolean;
    analytics_storage: boolean;
    ad_user_data: boolean;
    ad_personalization: boolean;
}

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    
    const [consent, setConsent] = useState<ConsentSettings>({
        ad_storage: false,
        analytics_storage: false,
        ad_user_data: false,
        ad_personalization: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const storedConsent = localStorage.getItem('qbamart_cookie_consent');
        if (!storedConsent) {
            // Show banner with a small delay for premium feel
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            try {
                const parsed = JSON.parse(storedConsent);
                if (parsed) {
                    setConsent({
                        ad_storage: !!parsed.ad_storage,
                        analytics_storage: !!parsed.analytics_storage,
                        ad_user_data: !!parsed.ad_user_data,
                        ad_personalization: !!parsed.ad_personalization,
                    });
                }
            } catch (e) {
                console.error('Error parsing stored consent', e);
            }
        }
    }, []);

    const updateConsent = (settings: ConsentSettings) => {
        // Save to local storage
        localStorage.setItem('qbamart_cookie_consent', JSON.stringify(settings));
        
        // Update Google Tag/GTM consent state
        if ((window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                ad_storage: settings.ad_storage ? 'granted' : 'denied',
                analytics_storage: settings.analytics_storage ? 'granted' : 'denied',
                ad_user_data: settings.ad_user_data ? 'granted' : 'denied',
                ad_personalization: settings.ad_personalization ? 'granted' : 'denied',
            });
        }

        // Hide banner
        setIsVisible(false);
    };

    const handleAcceptAll = () => {
        const allGranted = {
            ad_storage: true,
            analytics_storage: true,
            ad_user_data: true,
            ad_personalization: true,
        };
        setConsent(allGranted);
        updateConsent(allGranted);
    };

    const handleRejectAll = () => {
        const allDenied = {
            ad_storage: false,
            analytics_storage: false,
            ad_user_data: false,
            ad_personalization: false,
        };
        setConsent(allDenied);
        updateConsent(allDenied);
    };

    const handleSavePreferences = () => {
        updateConsent(consent);
    };

    const toggleConsentParam = (param: keyof ConsentSettings) => {
        setConsent(prev => ({
            ...prev,
            [param]: !prev[param],
        }));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-[calc(100%-2rem)] md:w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                            Cookie Consent & Privacy
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                            We use cookies to enhance your experience, analyze site traffic, and personalize advertising. Learn more in our{' '}
                            <a href="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                Privacy Policy
                            </a>.
                        </p>
                    </div>
                </div>

                {/* Custom Settings Panel */}
                {showCustomize && (
                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-2 flex flex-col gap-3">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            Custom Preferences
                        </h5>
                        
                        {/* Analytics Storage */}
                        <div className="flex items-center justify-between py-1">
                            <div className="flex flex-col pr-4">
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Analytics Storage</span>
                                <span className="text-xs text-neutral-400">Enables site analytics like tracking pages visited</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleConsentParam('analytics_storage')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    consent.analytics_storage ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        consent.analytics_storage ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Ad Storage */}
                        <div className="flex items-center justify-between py-1">
                            <div className="flex flex-col pr-4">
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Ad Storage</span>
                                <span className="text-xs text-neutral-400">Enables storage related to advertising (e.g. cookies)</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleConsentParam('ad_storage')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    consent.ad_storage ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        consent.ad_storage ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Ad User Data */}
                        <div className="flex items-center justify-between py-1">
                            <div className="flex flex-col pr-4">
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Ad User Data</span>
                                <span className="text-xs text-neutral-400">Allows sending user data to Google for advertising</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleConsentParam('ad_user_data')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    consent.ad_user_data ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        consent.ad_user_data ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Ad Personalization */}
                        <div className="flex items-center justify-between py-1">
                            <div className="flex flex-col pr-4">
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Ad Personalization</span>
                                <span className="text-xs text-neutral-400">Enables personalized advertising (retargeting)</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleConsentParam('ad_personalization')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    consent.ad_personalization ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        consent.ad_personalization ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {showCustomize ? (
                        <>
                            <button
                                onClick={handleSavePreferences}
                                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200"
                            >
                                Save Preferences
                            </button>
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition duration-200"
                            >
                                Back
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleRejectAll}
                                className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition duration-200"
                            >
                                Reject All
                            </button>
                            <button
                                onClick={() => setShowCustomize(true)}
                                className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition duration-200"
                            >
                                Customize
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
