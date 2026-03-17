/** @format */

import type { Component, NamedExoticComponent, Ref } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
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

export type InterceptionEvent = NativeSyntheticEvent<{
  url: string;
  scheme: string;
  host: string;
  path: string;
  fragment: string;
  method: string;
  requestId: string;
  isForMainFrame: boolean;
  isRedirect: boolean;
  headers: {
    [key: string]: string | undefined;
  };
  query: {
    raw: string;
    params: {
      [key: string]: string | string[] | undefined;
    };
  };
}>;

export type WebViewProps = Omit<CommunityWebViewProps, 'nativeConfig'> & {
  ref?: Ref<WebViewMethods>;
  interceptionTimeout?: number;
  skipInterceptionForExtensions?: string[];
  onShouldInterceptRequest?: (event: InterceptionEvent) => boolean | void;
};

export const EXTENSIONS: string[];
export const WebView: NamedExoticComponent<WebViewProps>;
export default WebView;

declare global {
  type GlobalInterceptionEvent = InterceptionEvent;
  type GlobalWebViewProps = WebViewProps;
}
