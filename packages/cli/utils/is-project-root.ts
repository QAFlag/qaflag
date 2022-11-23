import { existsSync } from 'fs-extra';
import path = require('path');

export const isPackageJson = (cwd = process.cwd()) => {
  return existsSync(path.resolve(cwd, 'package.json'));
};

export const isTsConfig = (cwd = process.cwd()) => {
  return existsSync(path.resolve(cwd, 'tsconfig.json'));
};
