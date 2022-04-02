import * as chalk from 'chalk';
import stringWidth from 'string-width';
import { getLongestLineLength } from '../utils/longest-line';

export type Alignment = 'left' | 'center' | 'right';

export type ConsoleLineOptions = {
  alignment: Alignment;
  lineLength: number;
  padding: string;
  style: chalk.Chalk;
  prefix: string;
};

const align = (
  line: string,
  length: number,
  alignment: Alignment,
  padding: string,
) => {
  const nonAsciiLength = stringWidth(line);
  const asciiLength = line.length - nonAsciiLength;
  padding = padding || ' ';
  // Right
  if (alignment == 'right') return line.padStart(length + asciiLength, padding);
  // Center
  if (alignment == 'center') {
    const padStart = Math.floor(length - nonAsciiLength / 2);
    const padEnd = Math.ceil(length - nonAsciiLength / 2);
    return (
      (padStart ? padding.repeat(padStart) : '') +
      line +
      (padEnd ? padding.repeat(padEnd) : '')
    );
  }
  // Left
  return line.padEnd(length + asciiLength, padding);
};

export class ConsoleOutput {
  public readonly lines: string[];

  constructor(
    text: string | string[],
    public readonly opts: Partial<ConsoleLineOptions> = {},
  ) {
    this.lines = (Array.isArray(text) ? text : [text]).map(line => {
      if (opts.prefix) line = `${opts.prefix}${line}`;
      return line;
    });
  }

  public print() {
    const lineLength = this.opts.lineLength || getLongestLineLength(this.lines);
    this.lines.forEach(line => {
      const text = align(
        line,
        lineLength,
        this.opts.alignment,
        this.opts.padding,
      );
      console.log(this.opts.style ? this.opts.style(text) : text);
    });
  }
}
