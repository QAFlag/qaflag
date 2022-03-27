export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export type KeyValue<T = any> = {
  [key: string]: T;
};

export type HttpHeaderValue = string;

export type HttpHeaders = {
  [key: string]: HttpHeaderValue;
};
