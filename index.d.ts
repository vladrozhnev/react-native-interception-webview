/** @format */

import type { Component, NamedExoticComponent, Ref } from 'react';
import type { WebView as CommunityWebView, WebViewProps as CommunityWebViewProps } from 'react-native-webview';

export type WebViewMethods = Omit<
  {
    [K in keyof InstanceType<typeof CommunityWebView> as InstanceType<typeof CommunityWebView>[K] extends (
      ...args: any[]
    ) => any
      ? K
      : never]: InstanceType<typeof CommunityWebView>[K];
  },
  keyof Component<any>
>;

export type InterceptionEvent = {
  url: string;
  scheme: string;
  host: string;
  path: string;
  fragment: string;
  method: string;
  requestId: string;
  query: {
    raw: string;
    params: {
      [key: string]: string | string[] | undefined;
    };
  };
};

export type WebViewProps = Omit<
  CommunityWebViewProps,
  'nativeConfig' | 'injectedJavaScriptBeforeContentLoadedForMainFrameOnly'
> & {
  ref?: Ref<WebViewMethods>;
  interruptionTimeout?: number;
  skipInterceptionForFileExtensions?: string[];
  onShouldInterruptRequest?: (event: InterceptionEvent) => boolean | void;
  onInterceptRequest?: (event: InterceptionEvent) => void;
};

export const SKIP_INTERCEPTION_FOR_FILE_EXTENSIONS: string[];
export const WebView: NamedExoticComponent<WebViewProps>;
export default WebView;

declare global {
  type GlobalInterceptionEvent = InterceptionEvent;
  type GlobalWebViewProps = WebViewProps;
}
