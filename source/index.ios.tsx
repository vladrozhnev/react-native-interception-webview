/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';

import { decodeURL } from './utils';

const JAVA_SCRIPT = `
  (function () {
    function postMessage(url, method, headers, requestId) {
      try {
        window.webkit.messageHandlers.ReactNativeWebView.postMessage(
          JSON.stringify({
            url: url || '',
            method: (method || 'GET').toUpperCase(),
            headers: headers || {},
            requestId: requestId,
            isForMainFrame: window.self === window.top,
          }),
        );
      } catch (error) {}
    }

    function makeId() {
      return String(Date.now()) + '-' + String(Math.random()).slice(2);
    }

    if (window.__interceptionWebViewPatched) return;
    window.__interceptionWebViewPatched = true;
    const origFetch = window.fetch;
    const origOpen = window.XMLHttpRequest.prototype.open;
    const origSend = window.XMLHttpRequest.prototype.send;
    const origSetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;

    try {
      window.fetch = function (input, init) {
        try {
          let url = '';
          let method = 'GET';
          let headers = {};
          let requestId = makeId();

          if (typeof input === 'string') {
            url = input;
          } else if (input && input.url) {
            url = input.url;
          }

          if (init?.method) {
            method = init.method;
          } else if (input?.method) {
            method = input.method;
          }

          if (init?.headers) {
            headers = init.headers;
          } else if (input?.headers) {
            headers = input.headers;
          }

          if (headers instanceof Headers) {
            headers = Object.fromEntries(headers.entries());
          } else {
            headers = headers || {};
          }

          postMessage(url, method, headers, requestId);
        } catch (error) {}

        return origFetch.apply(this, arguments);
      };

      window.XMLHttpRequest.prototype.open = function (method, url) {
        try {
          this.__url = new URL(url).href;
        } catch (error) {
          try {
            this.__url = new URL(url, window.location.href).href;
          } catch (error) {
            this.__url = url;
          }
        }

        this.__method = method;
        this.__requestId = makeId();
        this.__headers = {};
        return origOpen.apply(this, arguments);
      };

      window.XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this.__headers = this.__headers || {};
        this.__headers[header] = value;
        return origSetRequestHeader.apply(this, arguments);
      };

      window.XMLHttpRequest.prototype.send = function () {
        postMessage(this.__url, this.__method, this.__headers, this.__requestId);
        return origSend.apply(this, arguments);
      };
    } catch (error) {}
  })();
`;

export const WebView = memo<GlobalWebViewProps>(
  ({ ref, injectedJavaScriptBeforeContentLoaded, onInterceptRequest, onMessage, ...props }): ReactNode => {
    const javaScript = useMemo((): string => {
      return `${JAVA_SCRIPT}${injectedJavaScriptBeforeContentLoaded || ''}`;
    }, [injectedJavaScriptBeforeContentLoaded]);

    const handleMessage = useCallback(
      (event: WebViewMessageEvent): void => {
        try {
          const { url, method, headers, requestId, isForMainFrame } = JSON.parse(event.nativeEvent.data);
          const { href, protocol, host, pathname, hash, search, searchParams } = new URL(decodeURL(url));

          onInterceptRequest?.({
            ...event,
            nativeEvent: {
              url: href,
              scheme: protocol.replace(':', ''),
              host: host,
              path: pathname,
              fragment: hash,
              method: method,
              requestId: requestId,
              isForMainFrame: isForMainFrame,
              isRedirect: false,
              headers: headers,
              query: {
                raw: search,
                params: Object.fromEntries(searchParams),
              },
            },
          });
        } catch {
        } finally {
          onMessage?.(event);
        }
      },
      [onInterceptRequest, onMessage],
    );

    return (
      <CommunityWebView
        {...props}
        ref={ref as Ref<CommunityWebView>}
        injectedJavaScriptBeforeContentLoaded={javaScript}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        onMessage={handleMessage}
      />
    );
  },
);

export * from './constants';
export default WebView;
