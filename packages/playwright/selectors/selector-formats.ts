import { ElementSelector_Type } from './elements';

type Lowercase_Alpha =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type Uppercase_Alpha = Uppercase<Lowercase_Alpha>;

type Alphabetic = `${Lowercase_Alpha | Uppercase_Alpha}`;

export type XPath = `${'//' | '..'}${string}`;
export type PlaywrightSelector = `${
  | Alphabetic
  | '.'
  | '['
  | '#'
  | ':'
  | '_'}${string}`;

export type QAFlag_Alias = `$${string}`;
export type ElementSelector_Prefix = `=${ElementSelector_Type}`;

export type QuoteSelector =
  | `'${string}'`
  | `"${string}"`
  | `*${string}*`
  | `^${string}*`
  | `*${string}$`;
