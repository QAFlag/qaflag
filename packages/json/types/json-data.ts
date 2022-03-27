export type JsonData =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JsonData }
  | Array<JsonData>;
