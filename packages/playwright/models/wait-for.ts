export interface WaitForUrlOpts {
  timeout?: number | undefined;
  waitUntil?:
    | 'load'
    | 'domcontentloaded'
    | 'networkidle'
    | 'commit'
    | undefined;
}

export interface WaitForNavigationOpts extends WaitForUrlOpts {
  url?: string | RegExp | ((url: URL) => boolean) | undefined;
}
