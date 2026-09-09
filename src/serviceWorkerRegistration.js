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
    // The document lives only in memory. Under registerType: 'autoUpdate' the
    // plugin hard-reloads the tab when a new service worker activates unless
    // onNeedReload is supplied, which would throw away whatever the user was
    // writing the moment a deploy lands. Supplying it keeps the new worker in
    // control for the next natural navigation instead.
    onNeedReload() {
      if (config && config.onUpdate) {
        config.onUpdate();
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
