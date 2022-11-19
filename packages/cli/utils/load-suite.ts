import { SuiteClass } from '../types/suite-collection';
import { SuiteConstructor, SuiteInterface } from '@qaflag/core';
import Project from '../models/project';

export const loadSuite = (
  selectedSuite: SuiteClass,
  project: Project,
): SuiteInterface => {
  const file = require(selectedSuite.fullPath);
  const suiteConstructor: SuiteConstructor = file[selectedSuite.className];
  const suite = new suiteConstructor({
    ...project.settings,
  });
  return suite;
};
