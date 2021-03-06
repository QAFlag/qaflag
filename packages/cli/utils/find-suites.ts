import path = require('path');
import Project from '../models/project';
import { SuiteCollection, SuiteClass } from '../types/suite-collection';
import { findFiles } from './find-files';

export const findSuites = (project: Project): SuiteCollection => {
  const folder = path.resolve(process.cwd(), project.settings.output.path);
  const files = findFiles(
    folder,
    project.settings.output.pattern || '**/*.suite.js',
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
  suiteClasses.sort((a, b) => (a.className < b.className ? -1 : 0));
  return {
    baseFolder: files.baseFolder,
    suiteClasses,
  };
};
