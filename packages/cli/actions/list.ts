import { findFiles } from '../utils/find-files';

export const list = () => {
  const files = findFiles(
    process.cwd() + '/packages/examples/dist/scenarios/',
    /\.suite\./,
  );
  console.log(JSON.stringify(files, null, 2));
};
