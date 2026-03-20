/** @format */

export const makeId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char: string): string => {
    const randomHex = (Math.random() * 16) | 0;
    const value = char === 'x' ? randomHex : (randomHex & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const getInterceptionEventData = (url: string): GlobalInterceptionEvent => {
  const data = new URL(url);

  return {
    url: data.href,
    scheme: data.protocol.replace(':', ''),
    host: data.host,
    path: data.pathname,
    fragment: data.hash,
    method: 'GET',
    requestId: makeId(),
    query: {
      raw: data.search,
      params: Object.fromEntries(data.searchParams),
    },
  };
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

      function postMessage(url) {
        try {
          window.webkit.messageHandlers.ReactNativeWebView.postMessage(url);
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
