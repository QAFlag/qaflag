export type HlsData =
  | string
  | number
  | boolean
  | null
  | { [x: string]: HlsData }
  | Array<HlsData>;
