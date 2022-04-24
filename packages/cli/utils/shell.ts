import { exec } from 'child_process';

export const shell = (command: string) => {
  const promise = new Promise<{ stdout: string; stderr: string }>(
    (resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve({ stdout, stderr });
      });
    },
  );
  return promise;
};
