import { SuiteClass } from '../types/suite-collection';
import { SuiteInterface } from '@qaflag/core';

export const loadSuite = (suite: SuiteClass): SuiteInterface => {
  const file = require(suite.fullPath);
  return new file[suite.className]();
};
