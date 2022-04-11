import { Cookie } from 'tough-cookie';
import { KeyValue } from '../types/general.types';

export type InputCookies = Cookie[] | KeyValue<string> | undefined;

export const getCookieArray = (cookies: InputCookies): Cookie[] => {
  if (!cookies) return [];
  if (Array.isArray(cookies)) return cookies;
  return Object.entries(cookies).map(cookie => {
    return new Cookie({
      key: cookie[0],
      value: cookie[1],
    });
  });
};
