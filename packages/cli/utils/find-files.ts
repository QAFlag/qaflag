import * as fs from 'fs-extra';
import { sep } from 'path';

export interface SuiteCollection {
  baseFolder: string;
  suiteClasses: {
    relativePath: string;
    fullPath: string;
    className: string;
  }[];
}

export const findFiles = (
  startFolder: string,
  pattern: RegExp,
  maxDepth: number = 2,
) => {
  const results: SuiteCollection = {
    baseFolder: startFolder,
    suiteClasses: [],
  };
  function findSuites(dir: string, depth: number) {
    // Does this folder exist?
    if (fs.pathExistsSync(dir)) {
      // Read contents
      const files = fs.readdirSync(dir);
      files
        .filter(file => pattern.test(file))
        .forEach(file => {
          // Drill into sub-folders, but only once!
          if (depth < maxDepth && fs.statSync(dir + file).isDirectory()) {
            findSuites(`${dir}${file}${sep}`, depth + 1);
          }
          // Push in any JS files
          else if (file.endsWith('.js')) {
            const fullPath = `${dir}${file}`;
            const exported = require(fullPath);
            Object.keys(exported).forEach(className => {
              results.suiteClasses.push({
                fullPath,
                relativePath: (dir + file).replace(startFolder, ''),
                className,
              });
            });
          }
        });
    }
  }
  findSuites(startFolder, 0);
  return results;
};
