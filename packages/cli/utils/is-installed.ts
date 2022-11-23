import { exec } from 'child_process';

export const isInstalled = (packageName: string) => {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
};

export const whichInstalled = (packageNames: string[]) => {
  return packageNames.find(packageName =>
    isInstalled(`@qaflag/${packageName}`),
  );
};

export const hasCli = (command: string) => {
  const promise = new Promise<boolean>((resolve, reject) => {
    exec(`${command} -v`, (error, stdout, _stderr) => {
      if (error) resolve(false);
      resolve(true);
    });
  });
  return promise;
};

export const whichCli = (cliNames: string[]) => {
  return cliNames.find(name => hasCli(name));
};
