import { printHeader } from '../utils/print';
import { findSuites } from '../utils/find-suites';
import { exitError } from '../utils/exit';
import { prompt } from 'prompts';
import { loadSuite } from '../utils/load-suite';
import { outputSuiteToConsole } from '../formatter/console';
import { SuiteClass, SuiteCollection } from '../types/suite-collection';
import Project from '../models/project';

export const run = async (project: Project, options: any) => {
  const suites = findSuites(project);
  const selection = !options.args?.length
    ? await pickSuite(suites)
    : findSuiteByName(suites, options.args[0]);
  if (!selection) exitError('No suite selected.');
  const suite = loadSuite(selection);
  suite.events.once('completed').then(() => outputSuiteToConsole(suite));
  suite.execute();
};

const findSuiteByName = (
  suites: SuiteCollection,
  name: string,
): SuiteClass | undefined => {
  const pattern = new RegExp('^' + name.replace('*', '.*') + '$', 'i');
  return suites.suiteClasses.find(suite => pattern.test(suite.className));
};

const pickSuite = async (suites: SuiteCollection): Promise<SuiteClass> => {
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
    initial: 0,
  });
  return selection.suite;
};
