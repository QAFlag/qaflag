export interface ProjectInterface {
  defaultDomain: string;
  theme: string;
  input: {
    path: string;
    pattern: string;
  };
  output: {
    path: string;
    pattern: string;
  };
}
