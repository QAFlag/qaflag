export interface File {
  fileName: string;
  relativePath: string;
  fullPath: string;
}

export interface FileResults {
  baseFolder: string;
  files: File[];
}
