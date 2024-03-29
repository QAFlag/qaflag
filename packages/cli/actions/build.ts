import { printLines } from '../utils/print';
import Project from '../models/project';
import { shell } from '../utils/shell';

export const build = async (project: Project) => {
  printLines(['', 'Transpiling test suites with tsc...', '']);
  const command = `tsc --project ${project.settings.tsConfigPath}`;
  return shell(command);
};
