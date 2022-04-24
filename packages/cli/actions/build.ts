import Project from '../models/project';
import { shell } from '../utils/shell';

export const build = async (project: Project) => {
  const command = `tsc --project qaflag.tsconfig.json`;
  return shell(command);
};
