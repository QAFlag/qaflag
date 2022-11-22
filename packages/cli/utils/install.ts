import { existsSync } from 'fs-extra';
import path = require('path');
import { exitError } from './exit';
import { shell } from './shell';

export const hasYarn = (cwd = process.cwd()) => {
  return existsSync(path.resolve(cwd, 'yarn.lock'));
};

export const hasPnpm = (cwd = process.cwd()) => {
  return existsSync(path.resolve(cwd, 'pnpm-lock.yaml'));
};

export const hasNpm = (cwd = process.cwd()) => {
  return existsSync(path.resolve(cwd, 'package-lock.json'));
};

export const whichPackageManager = (
  cwd = process.cwd(),
): 'npm' | 'yarn' | 'pnpm' | null => {
  if (hasNpm(cwd)) return 'npm';
  if (hasYarn(cwd)) return 'yarn';
  if (hasPnpm(cwd)) return 'pnpm';
  return null;
};

export const addPackages = (packages: string[]) => {
  const which = whichPackageManager();
  if (which === 'npm') {
    return shell(`npm i --save-dev ${packages.join(' ')}`);
  }
  if (which === 'yarn') {
    return shell(`yarn add ${packages.join(' ')} -D`);
  }
  if (which === 'pnpm') {
    return shell(`pnpm add -D ${packages.join(' ')}`);
  }
  exitError(
    'No package manager detected for this project. Run this command in the root of your project, where the package.json is located.',
  );
};
