import * as fs from 'fs-extra';
import { sep } from 'path';
import { FileResults } from '../types/file-results';

export const findFiles = (
  startFolder: string,
  pattern: RegExp,
  maxDepth: number = 2,
): FileResults => {
  const results: FileResults = {
    baseFolder: startFolder,
    files: [],
  };
  function findFiles(dir: string, depth: number) {
    // Does this folder exist?
    if (fs.pathExistsSync(dir)) {
      // Read contents
      const files = fs.readdirSync(dir);
      files
        .filter(file => pattern.test(file))
        .forEach(fileName => {
          const fullPath = `${dir}${fileName}`;
          // Drill into sub-folders, but only once!
          if (depth < maxDepth && fs.statSync(fullPath).isDirectory()) {
            findFiles(`${fullPath}${sep}`, depth + 1);
          }
          // Push in any JS files
          else if (fullPath.endsWith('.js')) {
            results.files.push({
              fullPath,
              relativePath: fullPath.replace(startFolder, ''),
              fileName,
            });
          }
        });
    }
  }
  findFiles(startFolder, 0);
  return results;
};
