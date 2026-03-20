/** @format */

import { memo, useCallback, useMemo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { NativeSyntheticEvent } from 'react-native';
import type { ReactNode, Ref } from 'react';
import type { WebViewNativeConfig } from 'react-native-webview/lib/WebViewTypes';

import { getFilteredInterceptionEventData } from './utils';
import { SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS } from './constants';
import InterceptionWebViewNativeComponent from './specs/InterceptionWebViewNativeComponent';
import NativeInterceptionWebViewModule from './specs/NativeInterceptionWebViewModule';

export const WebView = memo<GlobalWebViewProps>(
  ({
    ref,
    interruptionTimeout = 5000,
    skipInterceptionForFileExtensions = SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS,
    onShouldInterruptRequest,
    onInterceptRequest,
    ...props
  }): ReactNode => {
    const handleInterceptRequest = useCallback(
      (event: NativeSyntheticEvent<GlobalInterceptionEvent>): void => {
        const data = getFilteredInterceptionEventData(event);
        onInterceptRequest?.(data);
      },
      [onInterceptRequest],
    );

    const handleShouldInterruptRequest = useCallback(
      (event: NativeSyntheticEvent<GlobalInterceptionEvent>): void => {
        const data = getFilteredInterceptionEventData(event);
        const interrupt = !!onShouldInterruptRequest?.(data);
        NativeInterceptionWebViewModule.setRequestAllowed(data.requestId, !interrupt);
      },
      [onShouldInterruptRequest],
    );

    const nativeConfig = useMemo((): WebViewNativeConfig => {
      return {
        component: InterceptionWebViewNativeComponent,
        props: {
          interruptionTimeout,
          hasOnShouldInterruptRequestHandler: !!onShouldInterruptRequest,
          skipInterceptionForFileExtensions,
          onInterceptRequest: handleInterceptRequest,
          onShouldInterruptRequest: handleShouldInterruptRequest,
        },
      };
    }, [
      interruptionTimeout,
      skipInterceptionForFileExtensions,
      onShouldInterruptRequest,
      handleInterceptRequest,
      handleShouldInterruptRequest,
    ]);

    return (
      <CommunityWebView
        {...props}
        ref={ref as Ref<CommunityWebView>}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        nativeConfig={nativeConfig}
      />
    );
  },
);

export * from './constants';
export default WebView;
