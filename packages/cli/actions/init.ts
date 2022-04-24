import prompts = require('prompts');
import { printHeader, printLines } from '../utils/print';
import Project from '../models/project';

export const init = async (project: Project) => {
  printHeader();
  printLines(['', 'Initialize QA Flag', '']);
  const responses = await prompts([
    {
      type: 'text',
      name: 'defaultDomain',
      message: `Default Domain to use for relative paths`,
      initial: 'http://localhost:3000',
    },
    {
      type: 'text',
      name: 'src',
      message: `Source folder where test suites will live`,
      initial: './src',
    },
  ]);
  project.settings.defaultDomain = responses.defaultDomain;
  project.settings.input.path = responses.src;
  project.write();
  printLines([
    '',
    '* Created qaflag.json',
    '* Created qaflag.tsconfig.json',
    '',
  ]);
};
