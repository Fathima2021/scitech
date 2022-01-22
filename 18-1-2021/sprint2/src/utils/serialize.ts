/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const serializer = (obj: any): string => {
  const str = [];
  for (const p in obj) {
    if (Array.isArray(obj[p])) {
      for (const iterator of obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(iterator));
      }
    } else {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
};
