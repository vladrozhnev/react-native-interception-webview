/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';

import { decodeURL } from './utils';

const JAVA_SCRIPT = `
  (function () {
    const origOpen = window.XMLHttpRequest.prototype.open;
    const origSend = window.XMLHttpRequest.prototype.send;

    function postMessage(url, method, requestId) {
      try {
        window.webkit.messageHandlers.ReactNativeWebView.postMessage(JSON.stringify({
          url: url,
          method: method,
          isForMainFrame: window.self === window.top,
          requestId: requestId,
        }));
      } catch(error) {}
    }

    function makeId() {
      return Date.now().toString();
    }

    if (window.__interceptionWebViewPatched) return;
    window.__interceptionWebViewPatched = true;

    try {
      window.XMLHttpRequest.prototype.open = function(method, url) {
        this.__url = url;
        this.__method = method;
        this.__requestId = makeId();
        return origOpen.apply(this, arguments);
      }

      window.XMLHttpRequest.prototype.send = function() {
        postMessage(this.__url, this.__method, this.__requestId);
        return origSend.apply(this, arguments);
      }
    } catch(error) {}
  })();
`;

export const WebView = memo<GlobalWebViewProps>(
  ({ ref, injectedJavaScriptBeforeContentLoaded, onInterceptRequest, onMessage, ...props }): ReactNode => {
    const injectedJavaScriptBeforeContentLoadedBoth = useMemo((): string => {
      return `${JAVA_SCRIPT}${injectedJavaScriptBeforeContentLoaded}`;
    }, [injectedJavaScriptBeforeContentLoaded]);

    const handleMessage = useCallback(
      (event: WebViewMessageEvent): void => {
        try {
          const { url, method, requestId, isForMainFrame } = JSON.parse(event.nativeEvent.data);
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
              headers: {},
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
        injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoadedBoth}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        onMessage={handleMessage}
      />
    );
  },
);

export * from './constants';
export default WebView;
