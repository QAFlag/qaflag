import prompts = require('prompts');
import {
  printHeader,
  printLineBreak,
  printLines,
  printList,
} from '../utils/print';
import Project from '../models/project';
import { addPackages } from '../utils/install';
import { humanReadableList, ProjectSettings } from '@qaflag/core';
import { exitError } from '../utils/exit';
import * as fs from 'fs-extra';

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
      type: 'text',
      name: 'dist',
      message: `Output folder for the transpiled suites`,
      initial: './dist',
    },
    {
      type: 'select',
      name: 'theme',
      message: 'Which theme do you prefer?',
      choices: [
        { title: 'Dark', value: 'dark' },
        { title: 'Light', value: 'light' },
      ],
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
    const packagesOutput = await addPackages([
      '@qaflag/core',
      ...responses.types,
    ]);
    printLines(['', ...packagesOutput, '']);
    project.settings.baseUrl = responses.baseUrl;
    project.settings.input.path = responses.src;
    project.settings.output.path = responses.dist;
    project.settings.theme = responses.theme;
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

export const ensurePathsExist = (settings: ProjectSettings) => {
  fs.ensureDirSync(settings.input.path);
  fs.ensureDirSync(settings.output.path);
  fs.ensureDirSync(settings.screenshotPath);
};
