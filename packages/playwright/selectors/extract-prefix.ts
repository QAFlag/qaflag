import { FindQuery } from './find-query';
import { attr, hasText, SelectModifier } from './modifiers';

export interface SelectorPrefix {
  prefix: string;
  value: string;
  modifier: SelectModifier | null;
}

export const alt: SelectModifier = (value: string): FindQuery =>
  attr('alt', value);

export const href: SelectModifier = (value: string): FindQuery =>
  attr('href', value);

export const src: SelectModifier = (value: string): FindQuery =>
  attr('src', value);

export const placeholder: SelectModifier = (value: string): FindQuery =>
  attr('placeholder', value);

export const title: SelectModifier = (value: string): FindQuery =>
  attr('title', value);

export const id: SelectModifier = (value: string): FindQuery =>
  attr('id', value);

const makeMap = <T extends Record<string, SelectModifier>>(map: T): T => map;
const AttributePrefixes = makeMap({
  alt,
  text: hasText,
  href,
  src,
  placeholder,
  id,
  title,
});
export type AttributePrefix = keyof typeof AttributePrefixes;

export const extractPrefix = (selector: string): SelectorPrefix | null => {
  const matches = selector.match(/^([a-z]+) ?= ?(.+)$/i);
  if (!matches) return null;
  const prefix = matches[1];
  const value = matches[2];
  return {
    prefix,
    value,
    modifier: AttributePrefixes[prefix] || null,
  };
};
