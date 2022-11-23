import { existsSync } from 'fs-extra';
import path = require('path');
import { hasCli } from './is-installed';

export const PackageManager_Enum = ['npm', 'yarn', 'pnpm'] as const;
export type PackageManager = typeof PackageManager_Enum[number];

const LockFileMap: Record<PackageManager, string> = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
};

export const isUsingPackageManager = (
  name: PackageManager,
  cwd = process.cwd(),
) => {
  return existsSync(path.resolve(cwd, LockFileMap[name]));
};

export const whichPackageManager = (
  cwd = process.cwd(),
): PackageManager | null => {
  // What are we using locally?
  const locallyUsed = PackageManager_Enum.find(name =>
    isUsingPackageManager(name, cwd),
  );
  if (locallyUsed) return locallyUsed;
  // What is installed globally?
  const globalCli = PackageManager_Enum.find(name => hasCli(name));
  return globalCli || null;
};
