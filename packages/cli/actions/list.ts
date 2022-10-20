import { printLines, printTable } from '../utils/print';
import { findSuites } from '../utils/find-suites';
import Project from '../models/project';
import chalk = require('chalk');

export const list = (project: Project) => {
  const suites = findSuites(project);
  printLines([
    '',
    'List QA Flag Suites',
    '',
    `Searching in: ${project.settings.output.path}`,
    `With pattern: ${project.settings.output.pattern}`,
    '',
  ]);
  printTable(
    [chalk.blueBright('Name'), chalk.blueBright('Path')],
    [32, 100],
    Object.values(suites.suiteClasses).map(suite => [
      suite.className,
      suite.relativePath,
    ]),
  );
};
