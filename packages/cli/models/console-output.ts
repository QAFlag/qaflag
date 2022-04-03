import * as chalk from 'chalk';
import cli from '../cli';
import stringWidth from 'string-width';

export type Alignment = 'left' | 'center' | 'right' | 'split';

export type ConsoleLineOptions = {
  alignment: Alignment;
  lineLength: number;
  padding: string;
  style: chalk.Chalk;
  prefix: string;
  suffix: string;
};

const concatLine = (line: Line) => {
  return Array.isArray(line) ? line.join(' ') : line;
};

const splitLine = (line: Line): [string, string] => {
  if (Array.isArray(line)) return [line[0] || '', line[1] || ''];
  return [line, ''];
};

const alignLeft = (line: Line, targetLength: number, padding: string = ' ') => {
  const nonAsciiLength = stringWidth(concatLine(line));
  const asciiLength = line.length - nonAsciiLength;
  return concatLine(line).padEnd(targetLength + asciiLength, padding);
};

const alignRight = (
  line: Line,
  targetLength: number,
  padding: string = ' ',
) => {
  const nonAsciiLength = stringWidth(concatLine(line));
  const asciiLength = line.length - nonAsciiLength;
  return concatLine(line).padStart(targetLength + asciiLength, padding);
};

const alignCenter = (
  line: Line,
  targetLength: number,
  padding: string = ' ',
) => {
  const text = concatLine(line);
  const nonAsciiLength = stringWidth(text);
  const padStart = Math.floor((targetLength - nonAsciiLength) / 2);
  const padEnd = Math.ceil((targetLength - nonAsciiLength) / 2);
  return (
    (padStart ? padding.repeat(padStart) : '') +
    text +
    (padEnd ? padding.repeat(padEnd) : '')
  );
};

const alignSplit = (
  line: Line,
  targetLength: number,
  padding: string = ' ',
) => {
  const split = splitLine(line);
  const nonAsciiLength = stringWidth(`${split[0]}${split[1]}`);
  const asciiLength = `${split[0]}${split[1]}`.length - nonAsciiLength;
  return (
    line[0] +
    line[1].padStart(targetLength + asciiLength - line[0].length, padding)
  );
};

const align = (
  line: Line,
  length: number,
  alignment: Alignment,
  padding: string,
) => {
  if (alignment == 'left') return alignLeft(line, length, padding);
  if (alignment == 'right') return alignRight(line, length, padding);
  if (alignment == 'center') return alignCenter(line, length, padding);
  return alignSplit(line, length, padding);
};

export type Line = string | [string, string];

export class ConsoleOutput {
  public readonly lines: Line[];

  constructor(
    text: Line | Line[],
    public readonly opts: Partial<ConsoleLineOptions> = {},
  ) {
    this.lines = (Array.isArray(text) ? text : [text]).map(line => {
      if (Array.isArray(line)) {
        return [
          `${opts.prefix || ''}${line[0]}`,
          `${line[1]}${opts.suffix || ''}`,
        ];
      } else {
        return `${opts.prefix || ''}${line}${opts.suffix || ''}`;
      }
    });
  }

  public print() {
    const lineLength = this.opts.lineLength || cli.lineLength;
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
