import { SuiteInterface } from '@qaflag/core';
import chalk = require('chalk');
import { printLineBreak, printLines } from '../utils/print';

export const outputSuiteToConsole = (suite: SuiteInterface) => {
  printLineBreak(2);
  printLines(['', suite.title, ''], {
    style: chalk.bold.bgHex('#000000').white,
    prefix: '  ',
  });
  printLines(
    [
      `Took ${suite.logger.duration}ms  |  Executed ${suite.scenarios.length} scenarios in ${suite.steps.length} steps`,
      suite.logger.failed
        ? chalk.bgHex('#550000').white(' FAILED ')
        : chalk.bgHex('#005500').white(' PASSED '),
      '',
    ],
    {
      style: chalk.bgWhite.black,
      prefix: '  ',
    },
  );

  suite.steps.forEach(step => {
    printLines(['', `Step ${step.stepNumber}`, ''], {
      style: chalk.bgBlack.yellow,
      prefix: '  ',
    });
    step.scenarios.forEach(scenario => {
      printLines(
        [
          '',
          chalk.whiteBright.bold(`${scenario.title}`) +
            `  ${scenario.description}`,
          ,
          '',
        ],
        { style: chalk.bgHex('#555555').hex('#aaaaaa'), prefix: '  ' },
      );
      printLines(
        [
          '',
          `  Took ${scenario.logger.duration}ms | ${scenario.type} | Persona: ${scenario.persona.name}`,
          ...scenario.logger.messages.map(message => {
            if (message.type == 'pass') {
              return chalk.green('✔') + ` ${message.text}`;
            } else if (message.type == 'fail') {
              return chalk.red('𐄂') + ` ${message.text}`;
            } else {
              return `  ${message.text}`;
            }
          }),
          '',
        ],
        {
          prefix: '  ',
          style: chalk.bgWhite.black,
        },
      );
    });
  });
  printLineBreak(2);
};
