import { printLineBreak, printLines, printTable } from '../utils/print';
import * as prompts from 'prompts';
import { exitError } from '../utils/exit';
import { findSuites } from '../utils/find-suites';
import { loadSuite } from '../utils/load-suite';
import Project from '../models/project';
import { titleize, formatUri } from '@qaflag/core';
import chalk = require('chalk');

export const plan = async (project: Project) => {
  const suites = findSuites(project);
  printLines(['', 'Show test plan', '']);
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
    initial: 0,
  });
  if (!selection.suite) {
    return exitError('No suite selected.');
  }
  const suite = loadSuite(selection.suite, project);
  printLineBreak();
  printLines([suite.title], { style: chalk.yellowBright });
  printLineBreak();
  if (suite.steps.length && suite.scenarios.length) {
    printLines(['SCENARIOS', '']);
    suite.steps.forEach(step => {
      if (suite.steps.length > 1) {
        printLines([`Step ${step.stepNumber}`]);
      }
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
            titleize(scenario.title),
            scenario.description,
            formatUri(scenario.uri),
            scenario.statusCode ? String(scenario.statusCode) : '--',
          ];
        }),
      );
      printLineBreak();
    });
  }
  if (suite.cases.length) {
    printLines(['TEST CASES', '']);
    printTable(
      [chalk.blueBright('Title'), chalk.blueBright('Description')],
      [40, 60],
      suite.cases.map(testCase => [testCase.title, testCase.description || '']),
    );
    printLineBreak();
  }
};
