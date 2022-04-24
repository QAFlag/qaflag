import prompts = require('prompts');
import { printHeader } from '../utils/print';
import Project from '../models/project';

export const init = async (project: Project) => {
  printHeader();
  const responses = await prompts([
    {
      type: 'text',
      name: 'defaultDomain',
      message: `Default Domain to use for relative paths`,
      initial: 'http://localhost:3000',
    },
  ]);
  project.settings.defaultDomain = responses.defaultDomain;
  project.write();
};
