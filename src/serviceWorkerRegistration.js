export async function register(config) {
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return;
  }

  const { registerSW } = await import('virtual:pwa-register');
  registerSW({
    immediate: true,
    onOfflineReady() {
      if (config && config.onSuccess) {
        config.onSuccess();
      }
    },
    onNeedRefresh() {
      if (config && config.onUpdate) {
        config.onUpdate();
      }
    },
  });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}
