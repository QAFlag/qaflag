import { exec } from 'child_process';

export const shell = (command: string) => {
  const promise = new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, _stderr) => {
      if (error) reject(stdout);
      resolve(stdout);
    });
  });
  return promise;
};
