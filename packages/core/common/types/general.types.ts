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

export type KeyValue = {
  [key: string]: any;
};

export type HttpHeaderValue = string | string[];

export type HttpHeaders = {
  [key: string]: HttpHeaderValue;
};
