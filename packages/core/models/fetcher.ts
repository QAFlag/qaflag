import { HttpResponse } from './http-response';
import { HttpRequest } from './http-request';
import { HttpRequestOptions } from '../types/http-request.interface';
import { fetchWithAxios } from '../utils/axios';

export type FetcherOptions<T> = {
  request: HttpRequestOptions;
  fetch?: (request: HttpRequest) => Promise<HttpResponse>;
  parse: (response: HttpResponse) => Promise<T>;
};

export class Fetcher<T> {
  #value: T | undefined = undefined;

  constructor(public readonly opts: FetcherOptions<T>) {}

  private fetch(req: HttpRequest): Promise<HttpResponse> {
    return this.opts.fetch === undefined
      ? fetchWithAxios(req)
      : this.opts.fetch(req);
  }

  public async getValue(overrides: { baseUrl?: string }): Promise<T> {
    if (this.#value !== undefined) return this.#value;
    const req = new HttpRequest({
      ...overrides,
      ...this.opts.request,
    });
    const res = await this.fetch(req);
    this.#value = await this.opts.parse(res);
    return this.#value;
  }
}
