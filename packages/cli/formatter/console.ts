import { SuiteInterface } from '@qaflag/core';
import chalk = require('chalk');
import { LightTheme } from '../themes/light';
import { DarkTheme } from '../themes/dark';
import { pill, printLineBreak, printLines } from '../utils/print';
import { titleize } from '@qaflag/core';

export const outputSuiteToConsole = (
  suite: SuiteInterface,
  useDarkTheme: boolean,
) => {
  const theme = useDarkTheme ? DarkTheme : LightTheme;
  printLineBreak(2);
  printLines(
    ['', [chalk.bold(suite.title), `${suite.logger.duration}ms`], ''],
    {
      style: suite.logger.failed
        ? chalk.bgHex(theme.suite.fail.bgColor).hex(theme.suite.fail.textColor)
        : chalk.bgHex(theme.suite.pass.bgColor).hex(theme.suite.pass.textColor),
      prefix: '  ',
      suffix: '  ',
      alignment: 'split',
    },
  );
  printLines(
    [
      '',
      [
        `Executed ${suite.scenarios.length} scenarios in ${suite.steps.length} steps.`,
        pill(
          `${suite.logger.count('fail')} FAILED`,
          theme.suite.fail.bgColor,
          theme.suite.pass.textColor,
        ) +
          '  ' +
          pill(
            ` ${suite.logger.count('pass')} PASSED `,
            theme.suite.pass.bgColor,
            theme.suite.pass.textColor,
          ),
      ],
      '',
    ],
    {
      style: chalk
        .bgHex(theme.suite.content.bgColor)
        .hex(theme.suite.content.textColor),
      prefix: '  ',
      suffix: '  ',
      alignment: 'split',
    },
  );

  suite.steps.forEach(step => {
    if (suite.steps.length > 1) {
      printLines(['', `Step ${step.stepNumber}`, ''], {
        style: chalk.bgHex(theme.step.bgColor).hex(theme.step.textColor),
        prefix: '  ',
        alignment: 'center',
      });
    }
    step.scenarios.forEach(scenario => {
      printLines(
        [
          '',
          [
            chalk
              .hex(theme.scenario.head.textColor)
              .bold(`${titleize(scenario.title)}`),
            scenario.description,
          ],
          [
            chalk.italic(
              `${scenario.request.method.toUpperCase()} ${
                scenario.request.url
              } (${scenario.type})`,
            ),
            chalk.italic(`${scenario.logger.duration}ms`),
          ],
          '',
        ],
        {
          style: chalk
            .bgHex(theme.scenario.head.bgColor)
            .hex(theme.scenario.head.subtextColor),
          prefix: '  ',
          suffix: ' ',
          alignment: 'split',
        },
      );
      printLines(
        [
          '',
          ...scenario.logger.messages.map(message => {
            if (message.type == 'pass') {
              return (
                chalk.hex(theme.scenario.content.pass.markerColor)(
                  theme.scenario.content.pass.marker,
                ) +
                chalk.hex(theme.scenario.content.pass.textColor)(
                  ` ${message.text}`,
                )
              );
            } else if (message.type == 'fail') {
              return (
                chalk.hex(theme.scenario.content.fail.markerColor)(
                  theme.scenario.content.fail.marker,
                ) +
                chalk.hex(theme.scenario.content.fail.textColor)(
                  ` ${message.text}`,
                )
              );
            } else if (message.type == 'optionalFail') {
              return (
                chalk.hex(theme.scenario.content.optionalFail.markerColor)(
                  theme.scenario.content.optionalFail.marker || ' ',
                ) +
                chalk.hex(theme.scenario.content.optionalFail.textColor)(
                  ` ${message.text}`,
                )
              );
            } else if (message.type == 'action') {
              return (
                chalk.hex(theme.scenario.content.action.markerColor)(
                  theme.scenario.content.action.marker,
                ) +
                ' ' +
                pill(
                  `${message.name || ''}`,
                  theme.scenario.content.action.pillBackgroundColor,
                  theme.scenario.content.action.pillTextColor,
                ) +
                chalk.hex(theme.scenario.content.action.textColor)(
                  ` ${message.text}`,
                )
              );
            } else if (message.type == 'heading') {
              return chalk.underline(
                chalk.bold(
                  chalk.hex(theme.scenario.content.action.textColor)(
                    `  ${message.text}  `,
                  ),
                ),
              );
            } else if (message.type == 'horizontalRule') {
              return '------';
            } else if (message.type == 'lineBreak') {
              return '';
            } else {
              return `  ${message.text}`;
            }
          }),
          '',
        ],
        {
          prefix: '  ',
          style: chalk
            .bgHex(theme.scenario.content.bgColor)
            .hex(theme.scenario.content.textColor),
        },
      );
    });
  });
  printLineBreak(2);
};
