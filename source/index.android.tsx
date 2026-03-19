/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';
import type { WebViewNativeConfig } from 'react-native-webview/lib/WebViewTypes';

import { EXTENSIONS } from './constants';
import InterceptionWebViewNativeComponent from './specs/InterceptionWebViewNativeComponent';
import NativeInterceptionWebViewModule from './specs/NativeInterceptionWebViewModule';

export const WebView = memo<GlobalWebViewProps>(
  ({
    ref,
    interruptionTimeout = 5000,
    skipInterceptionForExtensions = EXTENSIONS,
    onShouldInterruptRequest,
    onInterceptRequest,
    ...props
  }): ReactNode => {
    const handleInterceptRequest = useCallback(
      (event: GlobalInterceptionEvent): void => {
        onInterceptRequest?.(event);
      },
      [onInterceptRequest],
    );

    const handleShouldInterruptRequest = useCallback(
      (event: GlobalInterceptionEvent): void => {
        const interrupt = !!onShouldInterruptRequest?.(event);
        NativeInterceptionWebViewModule.setRequestAllowed(event.nativeEvent.requestId, !interrupt);
      },
      [onShouldInterruptRequest],
    );

    const nativeConfig = useMemo((): WebViewNativeConfig => {
      return {
        component: InterceptionWebViewNativeComponent,
        props: {
          interruptionTimeout,
          hasInterruptHandler: !!onShouldInterruptRequest,
          skipInterceptionForExtensions,
          onInterceptRequest: handleInterceptRequest,
          onShouldInterruptRequest: handleShouldInterruptRequest,
        },
      };
    }, [
      interruptionTimeout,
      skipInterceptionForExtensions,
      onShouldInterruptRequest,
      handleInterceptRequest,
      handleShouldInterruptRequest,
    ]);

    return <CommunityWebView {...props} ref={ref as Ref<CommunityWebView>} nativeConfig={nativeConfig} />;
  },
);

export * from './constants';
export default WebView;
