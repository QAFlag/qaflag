export interface ProjectInterface {
  baseUrl: string;
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
