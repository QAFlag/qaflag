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
import { exitError } from 'utils/exit';

export const init = async (project: Project) => {
  printHeader();
  printLines(['', 'Initialize QA Flag', '']);
  const responses = await prompts([
    {
      type: 'text',
      name: 'baseUrl',
      message: `Base URL to use for relative paths`,
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
  try {
    await addPackages(['@qaflag/core', ...responses.types]);
    project.settings.baseUrl = responses.baseUrl;
    project.settings.input.path = responses.src;
    project.write();
    printLineBreak();
    printList([
      'Installed QA Flag core depdenency',
      `Installed QA Flag types: ${humanReadableList(responses.types)}`,
      'Created QAFlag Configuration - qaflag.json',
      `Created TS Config - ${project.settings.tsConfigPath}`,
    ]);
    printLineBreak();
  } catch (ex) {
    return exitError(ex);
  }
};
