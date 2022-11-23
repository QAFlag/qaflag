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
import { PackageManager_Enum, whichPackageManager } from '../utils/which';
import { isPackageJson } from '../utils/is-project-root';

export const init = async (project: Project) => {
  const packageManager = whichPackageManager();
  const packageManagerIndex =
    packageManager === null ? 4 : PackageManager_Enum.indexOf(packageManager);
  printHeader();
  printLines(['', 'Initialize QA Flag', '']);
  // Must run in root
  if (!isPackageJson()) {
    return exitError(
      "Please run this command in your project's root folder. Could not find package.json. If this is a new project, you must initialize it first with your package manager.",
    );
  }
  const responses = await prompts([
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      initial: packageManagerIndex,
      choices: [
        { value: 'npm', title: 'NPM' },
        { value: 'yarn', title: 'Yarn' },
        { value: 'pnpm', title: 'PNPM' },
        { value: 'none', title: 'None, skip installing dependencies' },
      ],
    },
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
    if (responses.packageManager !== 'none') {
      const packagesOutput = await addPackages(responses.packageManager, [
        '@qaflag/core',
        ...responses.types,
      ]);
      printLines(['', ...packagesOutput, '']);
    }
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
