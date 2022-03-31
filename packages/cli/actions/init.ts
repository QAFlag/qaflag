import prompts = require('prompts');
import { printHeader } from '../utils/print';
import Project from '../models/project';

export const init = async (project: Project) => {
  printHeader();
  const response = await prompts({
    name: 'create',
    type: 'confirm',
    message: 'Create a QA Flag init file?',
    initial: true,
  });
  if (response.create) {
    project.write();
  }
};
