import { shell } from './shell';
import { PackageManager } from './which';

export const addPackages = async (
  packageManager: PackageManager,
  packages: string[],
): Promise<string[]> => {
  const out: string[] = [];
  const command = (() => {
    if (packageManager === 'yarn') {
      return `yarn add -D ${packages.join(' ')}`;
    }
    if (packageManager === 'pnpm') {
      return `pnpm add -D ${packages.join(' ')}`;
    }
    return `npm i --save-dev ${packages.join(' ')}`;
  })();
  out.push(
    `Installing dependencies with ${packageManager}...`,
    '',
    command,
    '',
  );
  try {
    out.push(await shell(command));
  } catch (ex) {
    out.push(ex);
  }
  return out;
};
