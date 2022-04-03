import * as chalk from 'chalk';
import cli from '../cli';
import Table = require('cli-table3');
import {
  ConsoleLineOptions,
  ConsoleOutput,
  Line,
} from '../models/console-output';

export const printHeader = () => {
  printLineBreak();
  new ConsoleOutput(['', '~~ QA FLAG ~~', ''], {
    alignment: 'center',
    lineLength: cli.lineLength,
    style: chalk.whiteBright.bold.bgHex('#0000aa'),
  }).print();
  new ConsoleOutput(`v${cli.version}`, {
    alignment: 'center',
    lineLength: cli.lineLength,
    style: chalk.black.bgHex('#bbbbbb'),
  }).print();
  printLineBreak();
};

export const printLines = (
  lines: Line[],
  opts?: Partial<ConsoleLineOptions>,
) => {
  new ConsoleOutput(lines, {
    alignment: 'left',
    lineLength: cli.lineLength,
    ...opts,
  }).print();
};

export const printList = (items: string[]) => {
  new ConsoleOutput(items, {
    alignment: 'left',
    lineLength: cli.lineLength,
    prefix: '  » ',
  }).print();
  printLineBreak();
};

export const printLineBreak = (n: number = 1) => {
  for (let i = 0; i < n; i++) {
    console.log('');
  }
};

export const printTable = (
  columnsNames: string[],
  columnWidths: number[],
  rows: string[][],
) => {
  const table = new Table({
    head: columnsNames,
    colWidths: columnWidths,
    wordWrap: true,
  });
  table.push(...rows);
  console.log(table.toString());
};

export const pill = (
  text: string,
  bgHex: string,
  fgHex: string = '#ffffff',
) => {
  return chalk.bgHex(bgHex).hex(fgHex)(` ${text} `);
};
