# React Native Interception WebView

![npm version](https://img.shields.io/npm/v/react-native-interception-webview?style=flat&labelColor=%23424242&color=%232196f3)
![npm downloads](https://img.shields.io/npm/dm/react-native-interception-webview?style=flat&labelColor=%23424242&color=%232196f3)
![npm license](https://img.shields.io/npm/l/react-native-interception-webview?style=flat&labelColor=%23424242&color=%232196f3)

Package that allows you to intercept web requests within the WebView component.
The current implementation supports only Android.
On iOS, the community WebView is used, but it does not provide the ability to intercept web requests.

## Compatibility

- Platform: **Android**
- Architecture: **New Architecture Only**
- React: **19+**
- React Native: **0.79+**

## Installation

This package is a native extension of the community [react-native-webview](https://github.com/react-native-webview/react-native-webview) package, so you need to install it as well.

```shell
yarn add react-native-webview react-native-interception-webview
```

## Documentation

The `WebView` component in this package inherits all methods and properties from the community WebView component.
The full list can be found [here](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md).

---

### onShouldInterceptRequest

Function that is called when the WebView intercepts a web request.
It is invoked using a SyntheticEvent, which wraps a NativeEvent.
This callback can return a boolean value.
If it returns `true` or nothing, the web request will continue loading; if it returns `false`, the web request will be interrupted.

Note that this function **blocks the WebView thread**, so it must execute quickly.

```typescript
const onShouldInterceptRequest = (event) => {
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
    return false;
  }
};
```

---

### interceptionTimeout

Property that specifies how much time is allocated for the `onShouldInterceptRequest` callback to complete.
Since `onShouldInterceptRequest` blocks the webview thread, a deadline must be set.
The default value is `5000` (5 sec).

```typescript
// If onShouldInterceptRequest takes more than 1 sec to complete
// then github.com will continue loading
return (
  <WebView
    source={{ uri: 'https://github.com' }}
    onShouldInterceptRequest={onShouldInterceptRequest}
    interceptionTimeout={1000}
  />
);
```

---

### skipInterceptionForExtensions

Property that specifies a list of file extensions to ignore when calling the `onShouldInterceptRequest` callback.
This helps prevent unnecessary interceptions, for example when loading images or CSS files.

The default value is:

```
['aac', 'avi', 'avif', 'bmp', 'css', 'eot', 'gif', 'heic', 'heif', 'ico', 'jpeg', 'jpg', 'js', 'm4a', 'm4v', 'mkv', 'mov', 'mp3', 'mp4', 'ogg', 'pdf', 'png', 'svg', 'tiff', 'ttf', 'wav', 'webm', 'webp', 'woff', 'woff2']
```

You can extend this list. It is also available for import as the `EXTENSIONS` constant.

```typescript
// onShouldInterceptRequest will not be called
// when JavaScript or CSS files are loaded
// but will be called for other web requests
return (
  <WebView
    source={{ uri: 'https://github.com' }}
    onShouldInterceptRequest={onShouldInterceptRequest}
    skipInterceptionForExtensions={['js', 'css']}
  />
);
```

## Quick Example

```tsx
import React from 'react';
import { WebView } from 'react-native-interception-webview';

export default function App() {
  const onShouldInterceptRequest = (event) => {
    const { url } = event.nativeEvent;

    if (url.includes('github')) {
      console.log('Blocking GitHub request');
      return false;
    }
  };

  return (
    <WebView
      source={{ uri: 'https://github.com' }}
      onShouldInterceptRequest={onShouldInterceptRequest}
      interceptionTimeout={1000}
    />
  );
}
