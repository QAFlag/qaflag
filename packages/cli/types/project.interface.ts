export interface ProjectInterface {
  baseUrl: string;
  theme: string;
  tsConfigPath: string;
  input: {
    path: string;
    pattern: string;
  };
  output: {
    path: string;
    pattern: string;
  };
}
