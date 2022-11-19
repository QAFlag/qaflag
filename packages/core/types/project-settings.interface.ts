export interface ProjectSettings {
  baseUrl: string;
  theme: string;
  tsConfigPath: string;
  screenshotPath: string;
  input: {
    path: string;
    pattern: string;
  };
  output: {
    path: string;
    pattern: string;
  };
}
