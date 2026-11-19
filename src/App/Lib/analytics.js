// Event names pushed to the Matomo Tag Manager data layer (public/matomo.js).
// The container maps each name to a Matomo event. Only the name is sent,
// never document text, headings or file names.
export const APP_EVENTS = {
  export: 'md2pdf_export',
  import: 'md2pdf_import',
};

export const trackAppEvent = (name) => {
  try {
    window._mtm = window._mtm || [];
    window._mtm.push({ event: name });
  } catch {
    // Analytics must never break the app.
  }
};
