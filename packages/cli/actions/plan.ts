import {
  printHeader,
  printLineBreak,
  printLines,
  printTable,
} from '../utils/print';
import * as prompts from 'prompts';
import { exitError } from '../utils/exit';
import { findSuites } from '../utils/find-suites';
import chalk = require('chalk');
import { loadSuite } from '../utils/load-suite';

export const plan = async () => {
  const suites = findSuites();
  printHeader();
  if (suites.suiteClasses.length == 0) {
    return exitError('No suites found.');
  }
  const selection = await prompts({
    type: 'select',
    name: 'suite',
    message: 'Pick a suite',
    choices: suites.suiteClasses.map(suite => ({
      title: suite.className,
      description: suite.relativePath,
      value: suite,
    })),
    initial: 1,
  });
  if (!selection.suite) {
    return exitError('No suite selected.');
  }
  const suite = loadSuite(selection.suite);
  printLineBreak();
  printLines([suite.title], { style: chalk.yellowBright });
  printLineBreak();
  suite.steps.forEach(step => {
    printLines([`Step ${step.stepNumber}`]);
    printTable(
      [
        chalk.blueBright('Title'),
        chalk.blueBright('Description'),
        chalk.blueBright('URI'),
        chalk.blueBright('Code'),
      ],
      [26, 40, 60, 6],
      step.scenarios.map(scenario => {
        return [
          scenario.title,
          scenario.description,
          scenario.uri,
          scenario.statusCode ? String(scenario.statusCode) : '--',
        ];
      }),
    );
    printLineBreak();
  });
};
