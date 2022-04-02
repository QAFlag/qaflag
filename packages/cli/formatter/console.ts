import { SuiteInterface } from '@qaflag/core';
import chalk = require('chalk');
import { printLineBreak, printLines } from '../utils/print';

export const outputSuiteToConsole = (suite: SuiteInterface) => {
  printLineBreak(2);
  printLines(
    ['', [chalk.bold(suite.title), `${suite.logger.duration}ms`], ''],
    {
      style: chalk.bgHex(suite.logger.failed ? '#550000' : '#005500').white,
      prefix: '  ',
      suffix: '  ',
      alignment: 'split',
    },
  );
  printLines(
    [
      '',
      `Executed ${suite.scenarios.length} scenarios in ${suite.steps.length} steps.`,
      chalk.bgHex('#550000').white(` ${suite.logger.count('fail')} FAILED `) +
        '  ' +
        chalk.bgHex('#005500').white(` ${suite.logger.count('pass')} PASSED `),
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
          [chalk.whiteBright.bold(`${scenario.title}`), scenario.description],
          ,
          '',
        ],
        {
          style: chalk.bgHex('#555555').hex('#aaaaaa'),
          prefix: '  ',
          suffix: ' ',
          alignment: 'split',
        },
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
            } else if (message.type == 'optionalFail') {
              return chalk.magenta('!') + ` ${message.text}`;
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
