import { AxiosStatic } from 'axios';
import { HttpHeaders, HttpVerbs } from '../types/http.types';
import { ScenarioUri } from '../scenario/scenario.interface';
import { parseUri } from '../utils/uri';
import MockAdapter = require('axios-mock-adapter');

interface MockReply {
  statusCode: number;
  data: any;
  headers?: HttpHeaders;
}

type MockListener =
  | 'onGet'
  | 'onPatch'
  | 'onPut'
  | 'onPost'
  | 'onHead'
  | 'onDelete'
  | 'onOptions'
  | 'onAny'
  | 'onList';

const verbMap: { [key in HttpVerbs]?: MockListener } = {
  get: 'onGet',
  patch: 'onPatch',
  put: 'onPut',
  post: 'onPost',
  head: 'onHead',
  delete: 'onDelete',
  options: 'onOptions',
};

export class AxiosMock {
  private adapter: MockAdapter;

  constructor(axios: AxiosStatic) {
    this.adapter = new MockAdapter(axios, { onNoMatch: 'passthrough' });
  }

  private getHandler(uri: ScenarioUri) {
    const { method, path } = parseUri(uri);
    const listener = verbMap[method] || 'onAny';
    return this.adapter[listener](path);
  }

  public reset() {
    this.adapter.reset();
  }

  public on(uri: ScenarioUri, reply: MockReply) {
    this.getHandler(uri).reply(async config => {
      if (typeof reply.data == 'function') {
        return [reply.statusCode, await reply.data(), reply.headers];
      }
      return [reply.statusCode, reply.data, reply.headers];
    });
  }

  public once(uri: ScenarioUri, reply: MockReply) {
    this.getHandler(uri).replyOnce(async config => {
      if (typeof reply.data == 'function') {
        return [reply.statusCode, await reply.data(), reply.headers];
      }
      return [reply.statusCode, reply.data, reply.headers];
    });
  }

  public error(uri: ScenarioUri, type: 'network' | 'timeout') {
    const handler = this.getHandler(uri);
    if (type == 'network') return handler.timeout();
    handler.networkError();
  }
}
