import { useEffect, useState, useCallback } from 'react';

const DISMISS_KEY = 'er_install_dismissed_at';
const DISMISS_HIDE_DAYS = 7;

function isStandalone() {
  return (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true
  );
}

function detectPlatform() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  // Order matters — Chrome UA contains "Safari" too.
  const isSafari = isIOS ? !/CriOS|FxiOS|EdgiOS/i.test(ua) : /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR/i.test(ua);
  const isFirefox = /Firefox|FxiOS/i.test(ua);
  const isSamsungBrowser = /SamsungBrowser/i.test(ua);
  const isMobile = isIOS || isAndroid;

  // Which install strategy applies?
  //   'native'          → we have a beforeinstallprompt event to fire
  //   'ios-safari'      → show 3-step Add-to-Home-Screen instructions
  //   'ios-other'       → tell user to open in Safari
  //   'android-manual'  → beforeinstallprompt hasn't fired; show ⋮ menu instructions
  //   'desktop-manual'  → show desktop chrome install icon instructions
  //   'unsupported'     → older browser
  return { isIOS, isAndroid, isDesktop, isSafari, isChrome, isFirefox, isSamsungBrowser, isMobile };
}

export function useInstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const platform = detectPlatform();

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
      return choice;
    } catch (e) {
      return { outcome: 'error', error: String(e) };
    }
  }, [deferredPrompt]);

  // What action should the button take when tapped?
  const getStrategy = () => {
    if (installed) return 'installed';
    if (deferredPrompt) return 'native';
    if (platform.isIOS && platform.isSafari) return 'ios-safari';
    if (platform.isIOS) return 'ios-other';
    if (platform.isAndroid) return 'android-manual';
    if (platform.isDesktop && platform.isChrome) return 'desktop-manual';
    return 'unsupported';
  };
  const strategy = getStrategy();

  // Should the button be visible at all?
  // Show whenever there's a plausible install path — much wider than the
  // strict "beforeinstallprompt fired" gate we had before.
  const canOffer = !installed && strategy !== 'unsupported';

  const dismiss = () => localStorage.setItem(DISMISS_KEY, String(Date.now()));
  const wasRecentlyDismissed = () => {
    const t = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return !!t && (Date.now() - t) < DISMISS_HIDE_DAYS * 24 * 3600 * 1000;
  };

  return {
    installed, platform, strategy, canOffer,
    promptInstall, dismiss, wasRecentlyDismissed,
  };
}
