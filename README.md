# React Native Interception WebView

Package that allows you to intercept web requests within the WebView component.

## Compatibility

- Platforms: **Android**, **iOS**
- Architecture: **New Architecture Only**
- React: **19+**
- React Native: **0.79+**

## Installation

This package is a native extension of the community [react-native-webview](https://github.com/react-native-webview/react-native-webview) package, so you need to install it as well.

```shell
yarn add react-native-webview react-native-interception-webview
```

## Usage

```tsx
import { WebView } from 'react-native-interception-webview';
```


## Documentation

The WebView component in this package inherits all methods and properties from the WebView component from the community, except two: `nativeConfig` and `injectedJavaScriptBeforeContentLoadedForMainFrameOnly`.
The full list can be found [here](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md).

---

### onShouldInterruptRequest 

Function that is called when the WebView intercepts a web request.
It is invoked using a SyntheticEvent, which wraps a NativeEvent.
This callback can return a boolean value.
If it returns `false` or nothing, the web request will continue loading; if it returns `true`, the web request will be interrupted.
Android only.

Note that this function **blocks the WebView thread**, so it must execute quickly.

```typescript
const onShouldInterruptRequest = (event) => {
  const {
    url,
    scheme,
    host,
    path,
    fragment,
    method,
    requestId,
    query,
    headers,
    isForMainFrame,
    isRedirect
  } = event.nativeEvent;

  if (url === 'https://github.com') {
    // Here we interrupt a web request to github.com
    return true;
  }
};
```

---

### onInterceptRequest

Function that is called when the WebView intercepts a web request.
It is invoked using a SyntheticEvent, which wraps a NativeEvent.
For iOS, only Fetch/XHR requests are available.

```typescript
const onInterceptRequest = (event) => {
  const {
    url,
    scheme,
    host,
    path,
    fragment,
    method,
    requestId,
    query,
    headers,
    isForMainFrame,
    isRedirect
  } = event.nativeEvent;

  if (url === 'https://github.com') {
    console.log(url);
  }
};
```

---

### interruptionTimeout

Property that specifies how much time is allocated for the `onShouldInterruptRequest` callback to complete.
Since `onShouldInterruptRequest` blocks the WebView thread, a deadline must be set.
Android only.
The default value is `5000` (5 sec).

```typescript
// If onShouldInterruptRequest takes more than 1 sec to complete
// then github.com will continue loading
return (
  <WebView
    source={{ uri: 'https://github.com' }}
    onShouldInterruptRequest={onShouldInterruptRequest}
    interruptionTimeout={1000}
  />
);
```

---

### skipInterceptionForExtensions

Property that specifies a list of file extensions to ignore when calling `onShouldInterruptRequest` and `onInterceptRequest` callbacks.
This helps prevent unnecessary interceptions, for example when loading images or CSS files.
Android only.
The default value is:

```
['aac', 'avi', 'avif', 'bmp', 'css', 'eot', 'gif', 'heic', 'heif', 'ico', 'jpeg', 'jpg', 'js', 'm4a', 'm4v', 'mkv', 'mov', 'mp3', 'mp4', 'ogg', 'pdf', 'png', 'svg', 'tiff', 'ttf', 'wav', 'webm', 'webp', 'woff', 'woff2']
```

You can extend this list. It is also available for import as the `EXTENSIONS` constant.

```typescript
// onShouldInterruptRequest will not be called
// when JavaScript or CSS files are loading
// but will be called for other web requests
return (
  <WebView
    source={{ uri: 'https://github.com' }}
    onShouldInterruptRequest={onShouldInterruptRequest}
    skipInterceptionForExtensions={['js', 'css']}
  />
);
```

## Quick Example

```tsx
import React from 'react';
import { WebView } from 'react-native-interception-webview';

export default function App() {
  const onShouldInterruptRequest = (event) => {
    const { url } = event.nativeEvent;

    if (url.includes('github')) {
      console.log('Blocking GitHub request');
      return true;
    }
  };

  return (
    <WebView
      source={{ uri: 'https://github.com' }}
      onShouldInterruptRequest={onShouldInterruptRequest}
      interruptionTimeout={1000}
    />
  );
}
```
