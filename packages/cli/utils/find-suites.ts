import { findFiles } from './find-files';

export const findSuites = () => {
  return findFiles(
    process.cwd() + '/packages/examples/dist/scenarios/',
    /\.suite\./,
  );
};
