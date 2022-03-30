export const exit = (isError: boolean = false) => {
  process.exit(isError ? 1 : 0);
};
