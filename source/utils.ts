/** @format */

export const makeId = () => {
  return Date.now().toString() + '-' + Math.random().toString().slice(2);
};

export const getJavaScript = (skipInterceptionForFileExtensions: string[]): string => {
  return `
    (function () {
      function containsEncodedComponents(url) {
        return decodeURI(url) !== decodeURIComponent(url);
      }

      function decodeURL(url = '') {
        const decodedURL = decodeURIComponent(url);
        return containsEncodedComponents(decodedURL) ? decodeURL(decodedURL) : decodedURL;
      }

      function makeId() {
        return Date.now().toString() + '-' + Math.random().toString().slice(2);
      }

      function postMessage(url) {
        try {
          window.webkit.messageHandlers.ReactNativeWebView.postMessage(
            JSON.stringify({
              url: url,
              requestId: makeId(),
              isForMainFrame: window.self === window.top,
            })
          );
        } catch (error) {}
      }

      if (window.__interceptionWebViewPatched) return;
      window.__interceptionWebViewPatched = true;

      try {
        const extensions = ${JSON.stringify(skipInterceptionForFileExtensions)};
        const regex = new RegExp('\\.(' + extensions.join('|') + ')($|[?&/=,])');

        new PerformanceObserver(function(list) {
          list.getEntries().forEach(function(entry) {
            const url = decodeURL(entry.name);

            if (!regex.test(url)) {
              postMessage(url);
            }
          });
        }).observe({ entryTypes: ['navigation', 'resource'], buffered: true });
      } catch (error) {}
    })();
  `;
};
