import * as fs from 'fs-extra';
import { sep } from 'path';
import path = require('path');
import { FileResults } from '../types/file-results';
import * as picomatch from 'picomatch';

export const findFiles = (
  startFolder: string,
  pattern: string,
  maxDepth: number = 8,
): FileResults => {
  const isMatch = picomatch(pattern);
  const results: FileResults = {
    baseFolder: startFolder,
    files: [],
  };
  function findFiles(dir: string, depth: number) {
    // Does this folder exist?
    if (fs.pathExistsSync(dir)) {
      // Read contents
      const files = fs.readdirSync(dir);
      files.forEach(fileName => {
        const fullPath = path.resolve(dir, fileName);
        // Drill into sub-folders, but only once!
        if (depth < maxDepth && fs.statSync(fullPath).isDirectory()) {
          findFiles(`${fullPath}${sep}`, depth + 1);
        }
        // Push in any JS files
        else if (isMatch(fileName)) {
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
