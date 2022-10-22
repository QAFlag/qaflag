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
