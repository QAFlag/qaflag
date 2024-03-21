import { findSuites } from '../utils/find-suites';
import { exitError, exitSuccess } from '../utils/exit';
import { prompt } from 'prompts';
import { loadSuite } from '../utils/load-suite';
import { outputSuiteToConsole } from '../formatter/console';
import { SuiteClass, SuiteCollection } from '../types/suite-collection';
import Project from '../models/project';
import { Command } from 'commander';
import { printLines } from '../utils/print';
import { build } from './build';
import pLimit = require('p-limit');

export const run = async (
  project: Project,
  options: { [key: string]: string | boolean },
  command: Command,
) => {
  // Overrides
  if (options.base) project.settings.baseUrl = String(options.base);
  // Build?
  if (options.build) {
    try {
      await build(project);
    } catch (ex) {
      printLines(['Error building tests.']);
      exitError(ex);
    }
  }
  const suites = findSuites(project);
  const selections = (
    options.all
      ? suites.suiteClasses
      : command.args?.length
        ? findSuiteByName(suites, command.args)
        : [await pickSuite(suites)]
  ).filter(selection => !!selection);
  if (!selections.length) return exitError('No suites selected.');
  const limit = pLimit(1);
  const completed = await Promise.all(
    selections.map(selection =>
      limit(async () => {
        const suite = loadSuite(selection, project);
        suite.events.on('completed', () =>
          outputSuiteToConsole(suite, project.settings.theme == 'dark'),
        );
        await suite.__execute();
        return suite;
      }),
    ),
  );
  const results = completed.map(suite => suite.results.status == 'pass');
  const passCount = results.filter(pass => pass).length;
  const failCount = results.filter(pass => !pass).length;
  if (selections.length > 1) {
    printLines([
      '',
      'Suite Results:',
      `${passCount} passed`,
      `${failCount} failed`,
      '',
    ]);
  }
  return failCount
    ? exitError('Some suites failed.')
    : exitSuccess('All suites passed.');
};

const findSuiteByName = (
  suites: SuiteCollection,
  names: string[],
): SuiteClass[] => {
  const out: SuiteClass[] = [];
  names.forEach(name => {
    const namePattern = new RegExp(`^${name.replace('*', '.*')}$`, 'i');
    const matches = suites.suiteClasses.filter(suite => {
      const fileName = (suite.relativePath.split('.') || []).pop() || '';
      return namePattern.test(suite.className) || namePattern.test(fileName);
    });
    if (matches.length) out.push(...matches);
  });
  return out;
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
