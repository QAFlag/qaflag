import chalk from 'chalk';
import { SuiteInterface } from '../types/suite.interface';

export class ConsoleFormatter {
  public static printSuite(suite: SuiteInterface) {
    console.log(chalk.bgBlackBright.whiteBright(suite.title));
  }
}
