import { fetchWithAxios } from '../utils/axios';
import { HttpRequest } from '../models/http-request';
import { HttpRequestOptions } from '../types/http-request.interface';

export const AfterSymbol = Symbol('After');

export function After(requestOpts?: HttpRequestOptions) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    target[AfterSymbol] = target[AfterSymbol] || {};
    target[AfterSymbol][methodName] = async (
      me: any,
      overrideOpts: Partial<HttpRequestOptions>,
    ) => {
      if (!requestOpts) return originalMethod.apply(me);
      const request = new HttpRequest({ ...requestOpts, ...overrideOpts });
      const response = await fetchWithAxios(request);
      return originalMethod.apply(me, [response]);
    };
    return descriptor;
  };
}
