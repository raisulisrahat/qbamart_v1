import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const CustomScripts = () => {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // 1. Handle Custom Head Script Injection
    let headScriptContainer = document.getElementById('custom-head-scripts');
    
    if (settings.enable_custom_head_script && settings.custom_head_script) {
      if (!headScriptContainer) {
        headScriptContainer = document.createElement('div');
        headScriptContainer.id = 'custom-head-scripts';
        headScriptContainer.style.display = 'none';
        document.head.appendChild(headScriptContainer);
      }
      
      // Clear previous injected scripts if any
      headScriptContainer.innerHTML = settings.custom_head_script;
      
      // Extract and execute script tags manually since innerHTML doesn't auto-run scripts
      const scriptElements = headScriptContainer.getElementsByTagName('script');
      Array.from(scriptElements).forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.head.appendChild(newScript);
        oldScript.remove(); // Clean up from the wrapper container
      });
    } else {
      if (headScriptContainer) {
        headScriptContainer.remove();
      }
    }
  }, [settings]);

  return null;
};

export default CustomScripts;
