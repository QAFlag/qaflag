export interface ProjectInterface {
  defaultDomain: string;
  input: {
    path: string;
    pattern: string;
  };
  output: {
    path: string;
    pattern: string;
  };
}
