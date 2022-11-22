import { existsSync, outputFile } from 'fs-extra';
import path = require('path');
import { exitError } from './exit';
import { printLines } from './print';
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

export const addPackages = async (packages: string[]): Promise<string[]> => {
  const which = whichPackageManager();
  const out: string[] = [];
  const installer = (() => {
    if (which === 'npm') {
      return {
        packageManager: 'npm',
        command: `npm i --save-dev ${packages.join(' ')}`,
      };
    }
    if (which === 'yarn') {
      return {
        packageManager: 'yarn',
        command: `yarn add ${packages.join(' ')} -D`,
      };
    }
    if (which === 'pnpm') {
      return {
        packageManager: 'pnpm',
        command: `pnpm add -D ${packages.join(' ')}`,
      };
    }
  })();
  if (!installer) {
    out.push(
      'No package manager detected for this project. Run this command in the root of your project, where the package.json is located.',
    );
  } else {
    out.push(`Found ${installer}`, installer.command, '');
    try {
      out.push(await shell(installer.command));
    } catch (ex) {
      out.push(ex);
    }
  }
  return out;
};
