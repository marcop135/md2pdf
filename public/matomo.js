/**
 * Self-hosted Matomo Tag Manager container (cookieless, honours Do Not Track).
 * Served as a same-origin file so the CSP needs no 'unsafe-inline'.
 * Tracker settings, tags and triggers live in the container; document content never is tracked.
 * Details: /privacy
 */
var _mtm = (window._mtm = window._mtm || []);
_mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
(function () {
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = 'https://mt.marcopontili.com/c/lLDa5XEL.js';
  s.parentNode.insertBefore(g, s);
})();
