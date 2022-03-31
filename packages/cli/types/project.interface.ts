export interface ProjectTests {
  path: string[];
  pattern: string[];
}

export interface ProjectInterface {
  tests: ProjectTests;
}
