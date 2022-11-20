import { escape } from '../utils/escape';
import { FindQuery } from './';
import { ExtractedText, extractText } from './extract-text';

export type SelectModifier = (selector: string, opt?: string) => FindQuery;

export const xpath: SelectModifier = (selector): FindQuery =>
  FindQuery.create(`xpath=${selector}`, selector);

export const text: SelectModifier = (value: string): FindQuery => {
  return FindQuery.create(`:text-is("${escape(value)}")`, `"${value}"`);
};

export const contains: SelectModifier = (value: string): FindQuery => {
  return FindQuery.create(`:has-text("${escape(value)}")`, `"${value}"`);
};

export const textPrefix: SelectModifier = (value: string): FindQuery => {
  const extracted = extractText(value);
  if (extracted) {
    if (extracted.pattern) {
      return matches(String(extracted.value), extracted.flags);
    }
    return text(extracted.value);
  }
  return text(value);
};

export const matches = (pattern: string, flags = 'i'): FindQuery => {
  return FindQuery.create(
    `:text-matches("${escape(pattern)}", "${flags}")`,
    `pattern like "${pattern}"`,
  );
};

export const attr = (
  name: string,
  text?: string | ExtractedText,
  tag?: string,
): FindQuery => {
  const equals = !text || typeof text == 'string' ? '=' : text.equalSign;
  const value = !text || typeof text == 'string' ? text : text.value;
  if (typeof text != 'string' && text?.type == 'custom') {
    throw `Attribute selectors do not support custom regex: ${tag}@${name}${equals}${value}`;
  }
  if (tag !== undefined && value !== undefined) {
    return FindQuery.create(
      `${tag}[${name}${equals}"${escape(value)}"]`,
      `${tag}@${name}${equals}"${value}"`,
    );
  }
  if (tag !== undefined) {
    return FindQuery.create(`${tag}[${name}]`, `${tag}[${name}]`);
  }
  if (value !== undefined) {
    return FindQuery.create(
      `[${name}${equals}"${escape(value)}"]`,
      `${name}${equals}"${value}"`,
    );
  }
  return FindQuery.create(`[${name}]`, `[${name}]`);
};

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
