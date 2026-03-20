/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';

import { SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS } from './constants';

const getJavaScript = (skipInterceptionForFileExtensions: string[]): string => {
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
        }).observe({ type: 'resource', buffered: true });
      } catch (error) {}
    })();
  `;
};

export const WebView = memo<GlobalWebViewProps>(
  ({
    ref,
    skipInterceptionForFileExtensions = SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS,
    injectedJavaScriptBeforeContentLoaded = '',
    onInterceptRequest,
    onMessage,
    ...props
  }): ReactNode => {
    const javaScript = useMemo((): string => {
      return `${getJavaScript(skipInterceptionForFileExtensions)}${injectedJavaScriptBeforeContentLoaded}`;
    }, [injectedJavaScriptBeforeContentLoaded, skipInterceptionForFileExtensions]);

    const handleMessage = useCallback(
      (event: WebViewMessageEvent): void => {
        try {
          const { url, requestId, isForMainFrame } = JSON.parse(event.nativeEvent.data);
          const { href, protocol, host, pathname, hash, search, searchParams } = new URL(url);

          onInterceptRequest?.({
            ...event,
            nativeEvent: {
              url: href,
              scheme: protocol.replace(':', ''),
              host: host,
              path: pathname,
              fragment: hash,
              requestId: requestId,
              isForMainFrame: isForMainFrame,
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
