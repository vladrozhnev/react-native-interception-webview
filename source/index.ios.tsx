/** @format */

import { memo } from 'react';
import { WebView as CommunityWebView } from 'react-native-webview';
import type { ReactNode, Ref } from 'react';

export const WebView = memo<GlobalWebViewProps>(({ ref, ...props }): ReactNode => {
  return <CommunityWebView {...props} ref={ref as Ref<CommunityWebView>} />;
});

export * from './constants';
export default WebView;
