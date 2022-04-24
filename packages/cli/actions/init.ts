import prompts = require('prompts');
import {
  printHeader,
  printLineBreak,
  printLines,
  printList,
} from '../utils/print';
import Project from '../models/project';
import { addPackages } from '../utils/install';
import { humanReadableList } from '@qaflag/core';

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
    {
      type: 'multiselect',
      name: 'types',
      message: 'Pick the test types for this project',
      choices: [
        { title: 'JSON', value: '@qaflag/json' },
        { title: 'Browser (Playwright)', value: '@qaflag/playwright' },
        { title: 'HTML', value: '@qaflag/html' },
        { title: 'XML, SOAP, RSS, or ATOM', value: '@qaflag/xml' },
      ],
      min: 1,
      hint: '- Space to select. Return to submit',
    },
  ]);
  await addPackages(['@qaflag/core', ...responses.types]);
  project.settings.defaultDomain = responses.defaultDomain;
  project.settings.input.path = responses.src;
  project.write();
  printLineBreak();
  printList([
    'Installed QA Flag core depdenency',
    `Installed QA Flag types: ${humanReadableList(responses.types)}`,
    'Created qaflag.json',
    'Created qaflag.tsconfig.json',
  ]);
  printLineBreak();
};
