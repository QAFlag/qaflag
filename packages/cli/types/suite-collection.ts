export interface SuiteClass {
  relativePath: string;
  fullPath: string;
  fileName: string;
  className: string;
}

export interface SuiteCollection {
  baseFolder: string;
  suiteClasses: SuiteClass[];
}
