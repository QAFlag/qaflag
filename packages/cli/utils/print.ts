import * as chalk from 'chalk';

type Alignment = 'left' | 'center' | 'right';

type LineOptions = {
  alignment: Alignment;
  lineLength: number;
  padding: string;
  style: chalk.Chalk;
};

const getLength = (lines: string[]) => {
  return lines.reduce((prev: number, line: string) => {
    return line.length > prev ? line.length : prev;
  }, 0);
};

const align = (
  line: string,
  length: number,
  alignment: Alignment,
  padding: string,
) => {
  padding = padding || ' ';
  // Left
  if (alignment == 'left') return line.padEnd(length, padding);
  // Right
  if (alignment == 'right') return line.padStart(length, padding);
  // Center
  const padStart = Math.floor(length - line.length / 2);
  const padEnd = Math.ceil(length - line.length / 2);
  return (
    (padStart ? padding.repeat(padStart) : '') +
    line +
    (padEnd ? padding.repeat(padEnd) : '')
  );
};

export const printLine = (lines: string[], opts?: Partial<LineOptions>) => {
  const lineLength = opts.lineLength || getLength(lines);
  lines.forEach(line => {
    const text = align(line, lineLength, opts.alignment, opts.padding);
    console.log(opts.style ? opts.style(text) : text);
  });
};
