export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export type KeyValue<T = any> = {
  [key: string]: T;
};
