export const HttpReadVerbsEnum = ['get', 'head'] as const;
export const HttpWriteVerbsEnum = ['delete', 'patch', 'post', 'put'] as const;
export const HttpVerbsEnum = [
  ...HttpReadVerbsEnum,
  ...HttpWriteVerbsEnum,
] as const;
export type HttpReadVerbs = typeof HttpReadVerbsEnum[number];
export type HttpWriteVerbs = typeof HttpWriteVerbsEnum[number];
export type HttpVerbs = typeof HttpVerbsEnum[number];
export type HttpVerbsCaseInsensitive = HttpVerbs | Uppercase<HttpVerbs>;
