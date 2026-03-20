/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import { getJavaScript, makeId } from './utils';
import { SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS } from './constants';

export const WebView = memo<GlobalWebViewProps>(
  ({
    ref,
    skipInterceptionForFileExtensions = SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS,
    injectedJavaScriptBeforeContentLoaded = '',
    onNavigationStateChange,
    onInterceptRequest,
    onMessage,
    ...props
  }): ReactNode => {
    const javaScript = useMemo((): string => {
      return `${getJavaScript(skipInterceptionForFileExtensions)}${injectedJavaScriptBeforeContentLoaded}`;
    }, [injectedJavaScriptBeforeContentLoaded, skipInterceptionForFileExtensions]);

    const getInterceptionEventData = useCallback((url: string, requestId: string): GlobalInterceptionEvent => {
      const { href, protocol, host, pathname, hash, search, searchParams } = new URL(url);

      return {
        url: href,
        scheme: protocol.replace(':', ''),
        host: host,
        path: pathname,
        fragment: hash,
        requestId: requestId,
        query: {
          raw: search,
          params: Object.fromEntries(searchParams),
        },
      };
    }, []);

    const handleMessage = useCallback(
      (event: WebViewMessageEvent): void => {
        try {
          const { url, requestId } = JSON.parse(event.nativeEvent.data);
          const data = getInterceptionEventData(url, requestId);

          onInterceptRequest?.(data);
        } catch {
        } finally {
          onMessage?.(event);
        }
      },
      [getInterceptionEventData, onInterceptRequest, onMessage],
    );

    const handleNavigationStateChange = useCallback(
      (event: WebViewNavigation): void => {
        try {
          const data = getInterceptionEventData(event.url, makeId());
          onInterceptRequest?.(data);
        } catch {
        } finally {
          onNavigationStateChange?.(event);
        }
      },
      [getInterceptionEventData, onInterceptRequest, onNavigationStateChange],
    );

    return (
      <CommunityWebView
        {...props}
        ref={ref as Ref<CommunityWebView>}
        injectedJavaScriptBeforeContentLoaded={javaScript}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        onMessage={handleMessage}
      />
    );
  },
);

export * from './constants';
export default WebView;
