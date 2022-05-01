import { HttpRequest } from '../models/http-request';
import { fetchWithAxios } from '../utils/axios';
import { HttpRequestOptions } from '../types/http-request.interface';

export const BeforeSymbol = Symbol('AuthenticatePersona');

export function Before(requestOpts?: HttpRequestOptions) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    target[BeforeSymbol] = target[BeforeSymbol] || {};
    target[BeforeSymbol][methodName] = async (
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
