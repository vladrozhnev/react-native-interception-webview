/** @format */

import { codegenNativeComponent } from 'react-native';
import type { DirectEventHandler, Double, Int32, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from 'react-native';

type WebViewNativeEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
}>;

type WebViewCustomMenuSelectionEvent = Readonly<{
  label: string;
  key: string;
  selectedText: string;
}>;

type WebViewMessageEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  data: string;
}>;

type WebViewOpenWindowEvent = Readonly<{
  targetUrl: string;
}>;

type WebViewHttpErrorEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  description: string;
  statusCode: Int32;
}>;

type WebViewErrorEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  domain?: string;
  code: Int32;
  description: string;
}>;

type WebViewNativeProgressEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  progress: Double;
}>;

type WebViewNavigationEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  navigationType: 'click' | 'formsubmit' | 'backforward' | 'reload' | 'formresubmit' | 'other';
  mainDocumentURL?: string;
}>;

type ShouldStartLoadRequestEvent = Readonly<{
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: Double;
  navigationType: 'click' | 'formsubmit' | 'backforward' | 'reload' | 'formresubmit' | 'other';
  mainDocumentURL?: string;
  isTopFrame: boolean;
}>;

type ScrollEvent = Readonly<{
  contentInset: {
    bottom: Double;
    left: Double;
    right: Double;
    top: Double;
  };
  contentOffset: {
    y: Double;
    x: Double;
  };
  contentSize: {
    height: Double;
    width: Double;
  };
  layoutMeasurement: {
    height: Double;
    width: Double;
  };
  targetContentOffset?: {
    y: Double;
    x: Double;
  };
  velocity?: {
    y: Double;
    x: Double;
  };
  zoomScale?: Double;
  responderIgnoreScroll?: boolean;
}>;

type WebViewRenderProcessGoneEvent = Readonly<{
  didCrash: boolean;
}>;

type WebViewDownloadEvent = Readonly<{
  downloadUrl: string;
}>;

interface NativeProps extends ViewProps {
  allowFileAccess?: boolean;
  allowsProtectedMedia?: boolean;
  allowsFullscreenVideo?: boolean;
  androidLayerType?: WithDefault<'none' | 'software' | 'hardware', 'none'>;
  cacheMode?: WithDefault<
    'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE' | 'LOAD_CACHE_ONLY',
    'LOAD_DEFAULT'
  >;
  domStorageEnabled?: boolean;
  downloadingMessage?: string;
  forceDarkOn?: boolean;
  geolocationEnabled?: boolean;
  lackPermissionToDownloadMessage?: string;
  messagingModuleName: string;
  minimumFontSize?: Int32;
  mixedContentMode?: WithDefault<'never' | 'always' | 'compatibility', 'never'>;
  nestedScrollEnabled?: boolean;
  onContentSizeChange?: DirectEventHandler<WebViewNativeEvent>;
  onRenderProcessGone?: DirectEventHandler<WebViewRenderProcessGoneEvent>;
  overScrollMode?: string;
  saveFormDataDisabled?: boolean;
  scalesPageToFit?: WithDefault<boolean, true>;
  setBuiltInZoomControls?: WithDefault<boolean, true>;
  setDisplayZoomControls?: boolean;
  setSupportMultipleWindows?: WithDefault<boolean, true>;
  textZoom?: Int32;
  thirdPartyCookiesEnabled?: WithDefault<boolean, true>;
  hasOnScroll?: boolean;
  allowingReadAccessToURL?: string;
  allowsBackForwardNavigationGestures?: boolean;
  allowsInlineMediaPlayback?: boolean;
  allowsPictureInPictureMediaPlayback?: boolean;
  allowsAirPlayForMediaPlayback?: boolean;
  allowsLinkPreview?: WithDefault<boolean, true>;
  automaticallyAdjustContentInsets?: WithDefault<boolean, true>;
  autoManageStatusBarEnabled?: WithDefault<boolean, true>;
  bounces?: WithDefault<boolean, true>;
  contentInset?: Readonly<{
    top?: Double;
    left?: Double;
    bottom?: Double;
    right?: Double;
  }>;
  contentInsetAdjustmentBehavior?: WithDefault<'never' | 'automatic' | 'scrollableAxes' | 'always', 'never'>;
  contentMode?: WithDefault<'recommended' | 'mobile' | 'desktop', 'recommended'>;
  dataDetectorTypes?: WithDefault<
    ReadonlyArray<
      | 'address'
      | 'link'
      | 'calendarEvent'
      | 'trackingNumber'
      | 'flightNumber'
      | 'lookupSuggestion'
      | 'phoneNumber'
      | 'all'
      | 'none'
    >,
    'phoneNumber'
  >;
  decelerationRate?: Double;
  directionalLockEnabled?: WithDefault<boolean, true>;
  enableApplePay?: boolean;
  hideKeyboardAccessoryView?: boolean;
  keyboardDisplayRequiresUserAction?: WithDefault<boolean, true>;
  limitsNavigationsToAppBoundDomains?: boolean;
  mediaCapturePermissionGrantType?: WithDefault<
    'prompt' | 'grant' | 'deny' | 'grantIfSameHostElsePrompt' | 'grantIfSameHostElseDeny',
    'prompt'
  >;
  pagingEnabled?: boolean;
  pullToRefreshEnabled?: boolean;
  refreshControlLightMode?: boolean;
  scrollEnabled?: WithDefault<boolean, true>;
  sharedCookiesEnabled?: boolean;
  textInteractionEnabled?: WithDefault<boolean, true>;
  useSharedProcessPool?: WithDefault<boolean, true>;
  onContentProcessDidTerminate?: DirectEventHandler<WebViewNativeEvent>;
  onCustomMenuSelection?: DirectEventHandler<WebViewCustomMenuSelectionEvent>;
  onFileDownload?: DirectEventHandler<WebViewDownloadEvent>;
  menuItems?: ReadonlyArray<
    Readonly<{
      label: string;
      key: string;
    }>
  >;
  suppressMenuItems?: Readonly<string>[];
  hasOnFileDownload?: boolean;
  fraudulentWebsiteWarningEnabled?: WithDefault<boolean, true>;
  allowFileAccessFromFileURLs?: boolean;
  allowUniversalAccessFromFileURLs?: boolean;
  applicationNameForUserAgent?: string;
  basicAuthCredential?: Readonly<{
    username: string;
    password: string;
  }>;
  cacheEnabled?: WithDefault<boolean, true>;
  incognito?: boolean;
  injectedJavaScript?: string;
  injectedJavaScriptBeforeContentLoaded?: string;
  injectedJavaScriptForMainFrameOnly?: WithDefault<boolean, true>;
  injectedJavaScriptBeforeContentLoadedForMainFrameOnly?: WithDefault<boolean, true>;
  javaScriptCanOpenWindowsAutomatically?: boolean;
  javaScriptEnabled?: WithDefault<boolean, true>;
  webviewDebuggingEnabled?: boolean;
  mediaPlaybackRequiresUserAction?: WithDefault<boolean, true>;
  messagingEnabled: boolean;
  onLoadingError: DirectEventHandler<WebViewErrorEvent>;
  onLoadingSubResourceError: DirectEventHandler<WebViewErrorEvent>;
  onLoadingFinish: DirectEventHandler<WebViewNavigationEvent>;
  onLoadingProgress: DirectEventHandler<WebViewNativeProgressEvent>;
  onLoadingStart: DirectEventHandler<WebViewNavigationEvent>;
  onHttpError: DirectEventHandler<WebViewHttpErrorEvent>;
  onMessage: DirectEventHandler<WebViewMessageEvent>;
  onOpenWindow?: DirectEventHandler<WebViewOpenWindowEvent>;
  hasOnOpenWindowEvent?: boolean;
  onScroll?: DirectEventHandler<ScrollEvent>;
  onShouldStartLoadWithRequest: DirectEventHandler<ShouldStartLoadRequestEvent>;
  showsHorizontalScrollIndicator?: WithDefault<boolean, true>;
  showsVerticalScrollIndicator?: WithDefault<boolean, true>;
  indicatorStyle?: WithDefault<'default' | 'black' | 'white', 'default'>;
  newSource: Readonly<{
    uri?: string;
    method?: string;
    body?: string;
    headers?: ReadonlyArray<
      Readonly<{
        name: string;
        value: string;
      }>
    >;
    html?: string;
    baseUrl?: string;
  }>;
  userAgent?: string;
  injectedJavaScriptObject?: string;
  paymentRequestEnabled?: boolean;

  interruptionTimeout?: Int32;
  skipInterceptionForFileExtensions?: string[];
  hasOnShouldInterruptRequestHandler?: boolean;
  onShouldInterruptRequest?: DirectEventHandler<
    Readonly<{
      url: string;
      scheme: string;
      host: string;
      path: string;
      fragment: string;
      requestId: string;
      query: Readonly<{
        raw: string;
        params: Readonly<{}>;
      }>;
    }>
  >;
  onInterceptRequest?: DirectEventHandler<
    Readonly<{
      url: string;
      scheme: string;
      host: string;
      path: string;
      fragment: string;
      requestId: string;
      query: Readonly<{
        raw: string;
        params: Readonly<{}>;
      }>;
    }>
  >;
}

export default codegenNativeComponent<NativeProps>('InterceptionWebView');
