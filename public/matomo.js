/**
 * Self-hosted Matomo (cookieless, honours Do Not Track).
 * Served as a same-origin file so the CSP needs no 'unsafe-inline'.
 * Only page views and outbound links are tracked; document content never is.
 * Details: /privacy
 */
var _paq = (window._paq = window._paq || []);
_paq.push(['setDoNotTrack', true]);
_paq.push(['disableCookies']);
_paq.push(['setRequestMethod', 'POST']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
  var u = 'https://mt.marcopontili.com/';
  var p = 'm/';
  _paq.push(['setTrackerUrl', u + p]);
  _paq.push(['setSiteId', '4']);
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = u + p;
  s.parentNode.insertBefore(g, s);
})();
