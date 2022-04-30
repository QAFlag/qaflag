import { HttpRequest } from '../models/http-request';
import { fetchWithAxios } from '../utils/axios';
import { HttpRequestOptions } from '../types/http-request.interface';
import { PersonaAuthenticateOpts } from './persona';

export const AuthenticateSymbol = Symbol('AuthenticatePersona');

export function Authenticate(requestOpts?: HttpRequestOptions) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const handler = descriptor.value;
    descriptor.value = async (overrideOpts: PersonaAuthenticateOpts) => {
      if (!requestOpts) return handler();
      const request = new HttpRequest({ ...requestOpts, ...overrideOpts });
      const response = await fetchWithAxios(request);
      return handler(response);
    };
    target[AuthenticateSymbol] = target[AuthenticateSymbol] || [];
    target[AuthenticateSymbol].push(methodName);
    return descriptor;
  };
}
