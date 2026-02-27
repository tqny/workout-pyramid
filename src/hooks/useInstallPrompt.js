import { useCallback, useEffect, useRef, useState } from "react";

function detectIOS() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || touchMac;
}

function detectStandalone() {
  if (typeof window === "undefined") return false;
  const viaDisplayMode = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const viaNavigator = window.navigator?.standalone === true;
  return Boolean(viaDisplayMode || viaNavigator);
}

export function useInstallPrompt() {
  const deferredPromptRef = useRef(null);
  const [isIOS, setIsIOS] = useState(() => detectIOS());
  const [isStandalone, setIsStandalone] = useState(() => detectStandalone());
  const [canNativeInstallPrompt, setCanNativeInstallPrompt] = useState(false);

  useEffect(() => {
    function syncEnvironment() {
      setIsIOS(detectIOS());
      setIsStandalone(detectStandalone());
    }

    syncEnvironment();
    window.addEventListener("resize", syncEnvironment);
    window.addEventListener("orientationchange", syncEnvironment);

    function onBeforeInstallPrompt(event) {
      event.preventDefault();
      deferredPromptRef.current = event;
      setCanNativeInstallPrompt(true);
    }

    function onAppInstalled() {
      deferredPromptRef.current = null;
      setCanNativeInstallPrompt(false);
      setIsStandalone(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("resize", syncEnvironment);
      window.removeEventListener("orientationchange", syncEnvironment);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) return { didPrompt: false, accepted: false };

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    const accepted = choice?.outcome === "accepted";
    deferredPromptRef.current = null;
    setCanNativeInstallPrompt(false);
    if (accepted) setIsStandalone(true);
    return { didPrompt: true, accepted };
  }, []);

  return {
    isIOS,
    isStandalone,
    canNativeInstallPrompt,
    shouldShowInstallAction: !isStandalone,
    promptInstall,
  };
}
