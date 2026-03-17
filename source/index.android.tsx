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
    interceptionTimeout = 5000,
    skipInterceptionForExtensions = EXTENSIONS,
    onShouldInterceptRequest = () => true,
    ...props
  }): ReactNode => {
    const handleShouldInterceptRequest = useCallback(
      (event: GlobalInterceptionEvent): void => {
        const allowed = onShouldInterceptRequest(event) as boolean | undefined;
        NativeInterceptionWebViewModule.setRequestAllowed(event.nativeEvent.requestId, allowed);
      },
      [onShouldInterceptRequest],
    );

    const nativeConfig = useMemo((): WebViewNativeConfig => {
      return {
        component: InterceptionWebViewNativeComponent,
        props: {
          interceptionTimeout,
          skipInterceptionForExtensions,
          onShouldInterceptRequest: handleShouldInterceptRequest,
        },
      };
    }, [interceptionTimeout, skipInterceptionForExtensions, handleShouldInterceptRequest]);

    return <CommunityWebView {...props} ref={ref as Ref<CommunityWebView>} nativeConfig={nativeConfig} />;
  },
);

export * from './constants';
export default WebView;
