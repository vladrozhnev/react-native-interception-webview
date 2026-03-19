/** @format */

function containsEncodedComponents(url: string): boolean {
  return decodeURI(url) !== decodeURIComponent(url);
}

export const decodeURL = (url: string = ''): string => {
  const decodedURL = decodeURIComponent(url);
  return containsEncodedComponents(decodedURL) ? decodeURL(decodedURL) : decodedURL;
};
