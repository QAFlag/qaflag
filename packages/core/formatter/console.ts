import chalk = require('chalk');
import { SuiteInterface } from '../types/suite.interface';

const print = (...lines: string[]) => {
  lines.forEach(line => console.log(line));
};

export class ConsoleFormatter {
  public static printSuite(suite: SuiteInterface) {
    print(chalk.bold(suite.title), '==========');
    suite.steps.forEach(step => {
      print('', chalk.yellow(`Step ${step.stepNumber}`), '');
      step.scenarios.forEach(scenario => {
        scenario.logger.getMessages().forEach(message => {
          if (message.type == 'pass') print(chalk.green(message.text));
          else if (message.type == 'fail') print(chalk.red(message.text));
          else print(message.text);
        });
      });
    });
  }
}
