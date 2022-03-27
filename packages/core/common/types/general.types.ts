export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export type JsonData =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JsonData }
  | Array<JsonData>;

export type KeyValue<T = any> = {
  [key: string]: T;
};

export type HttpHeaderValue = string;

export type HttpHeaders = {
  [key: string]: HttpHeaderValue;
};
