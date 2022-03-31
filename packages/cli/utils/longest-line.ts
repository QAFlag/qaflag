export const getLongestLineLength = (lines: string[]) => {
  return lines.reduce((prev: number, line: string) => {
    return line.length > prev ? line.length : prev;
  }, 0);
};
