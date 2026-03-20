/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import { getInterceptionEventData, getJavaScript } from './utils';
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

    const handleMessage = useCallback(
      (event: WebViewMessageEvent): void => {
        try {
          const data = getInterceptionEventData(event.nativeEvent.data);
          onInterceptRequest?.(data);
        } catch {
        } finally {
          onMessage?.(event);
        }
      },
      [onInterceptRequest, onMessage],
    );

    const handleNavigationStateChange = useCallback(
      (event: WebViewNavigation): void => {
        try {
          const data = getInterceptionEventData(event.url);
          onInterceptRequest?.(data);
        } catch {
        } finally {
          onNavigationStateChange?.(event);
        }
      },
      [onInterceptRequest, onNavigationStateChange],
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
