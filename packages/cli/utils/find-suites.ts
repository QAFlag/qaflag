import { SuiteCollection, SuiteClass } from '../types/suite-collection';
import { findFiles } from './find-files';

export const findSuites = (): SuiteCollection => {
  const files = findFiles(
    process.cwd() + '/packages/examples/dist/scenarios/',
    /\.suite\./,
  );
  const suiteClasses: SuiteClass[] = [];
  files.files.forEach(file => {
    const exported = require(file.fullPath);
    Object.keys(exported).forEach(className => {
      suiteClasses.push({
        fullPath: file.fullPath,
        relativePath: file.relativePath,
        fileName: file.fileName,
        className,
      });
    });
  });
  return {
    baseFolder: files.baseFolder,
    suiteClasses,
  };
};
