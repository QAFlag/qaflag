import { KeyValue } from './general.types';

export const CONTENT_TYPE_JSON = 'application/json';
export const CONTENT_TYPE_XML = 'application/xml';
export const CONTENT_TYPE_SOAP = 'application/soap+xml';
export const CONTENT_TYPE_FORM_MULTIPART = 'multipart/form-data';
export const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded';
export const ENCODING_GZIP = 'gzip,deflate';

export const HttpReadVerbsEnum = ['get', 'head', 'options'] as const;
export const HttpWriteVerbsEnum = [
  'delete',
  'patch',
  'post',
  'put',
  'purge',
  'link',
  'unlink',
] as const;
export const HttpVerbsEnum = [
  ...HttpReadVerbsEnum,
  ...HttpWriteVerbsEnum,
] as const;
export type HttpReadVerbs = typeof HttpReadVerbsEnum[number];
export type HttpWriteVerbs = typeof HttpWriteVerbsEnum[number];
export type HttpVerbs = typeof HttpVerbsEnum[number];
export type HttpVerbsCaseInsensitive = HttpVerbs | Uppercase<HttpVerbs>;

export type HttpAuthType = 'basic' | 'digest' | 'auto';

export type HttpAuth = {
  type: HttpAuthType;
  username: string;
  password: string;
};

export type HttpTimeout = {
  read?: number;
  open?: number;
  response?: number;
};

export type HttpProtocol = 'http' | 'https';

export type HttpProxy = {
  protocol: HttpProtocol;
  host: string;
  port: number;
  auth: HttpAuth;
};

export type HttpData =
  | Buffer
  | KeyValue
  | NodeJS.ReadableStream
  | string
  | null
  | undefined;

export type HttpBody = Buffer | KeyValue | string | null;

export type HttpResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export type HttpStatus = { code: number; text: string };
