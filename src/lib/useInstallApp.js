import { useEffect, useState, useCallback } from 'react';

const DISMISS_KEY = 'er_install_dismissed_at';
const DISMISS_HIDE_DAYS = 7;

function isStandalone() {
  return (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true
  );
}

function detectOS() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return { isIOS, isAndroid, isDesktop, isSafari };
}

// Manages the PWA install lifecycle.
export function useInstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const os = detectOS();

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: 'unavailable' };
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return choice; // { outcome: 'accepted' | 'dismissed', platform }
    } catch (e) {
      return { outcome: 'error', error: String(e) };
    }
  }, [deferredPrompt]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const wasRecentlyDismissed = () => {
    const t = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (!t) return false;
    return (Date.now() - t) < DISMISS_HIDE_DAYS * 24 * 3600 * 1000;
  };

  // Can we actually offer install right now?
  const canInstallNative = !!deferredPrompt;         // Android/Chromium/Edge/desktop-Chrome
  const canInstallIOS = os.isIOS && os.isSafari && !installed; // iOS Safari has no API, show instructions
  const canOffer = !installed && (canInstallNative || canInstallIOS);

  return {
    installed, os,
    canInstallNative, canInstallIOS, canOffer,
    promptInstall, dismiss, wasRecentlyDismissed,
  };
}
