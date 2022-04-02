import { printHeader, printLines } from '../utils/print';
import { findSuites } from '../utils/find-suites';
import { exitError } from '../utils/exit';
import { prompt } from 'prompts';
import { loadSuite } from '../utils/load-suite';
import chalk = require('chalk');

export const run = async () => {
  const suites = findSuites();
  printHeader();
  if (suites.suiteClasses.length == 0) {
    return exitError('No suites found.');
  }
  const selection = await prompt({
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
  suite.events.once('completed').then(() => {
    printLines([suite.title, '=========='], {
      style: chalk.bold,
    });
    suite.steps.forEach(step => {
      printLines(['', chalk.yellow(`Step ${step.stepNumber}`), '']);
      step.scenarios.forEach(scenario => {
        scenario.logger.getMessages().forEach(message => {
          if (message.type == 'pass') {
            printLines([chalk.green(message.text)]);
          } else if (message.type == 'fail') {
            printLines([chalk.red(message.text)]);
          } else {
            printLines([message.text]);
          }
        });
      });
    });
  });
  suite.execute();
};
