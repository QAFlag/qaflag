import Project from '../models/project';
import { exec } from 'child_process';

export const build = async (project: Project) => {
  const command = `tsc --project qaflag.tsconfig.json`;
  exec(command);
};
