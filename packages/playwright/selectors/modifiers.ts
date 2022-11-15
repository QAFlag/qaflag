import { escape } from '../utils/escape';
import { FindQuery } from './';
import { extractRegex, extractText } from './is-prefixed';

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
  const quoted = extractText(value);
  if (quoted) return text(quoted.text);
  const regex = extractRegex(value);
  if (regex) return matches(regex.pattern, regex.flags);
  return text(value);
};

export const matches = (pattern: string, flags = 'i'): FindQuery => {
  return FindQuery.create(
    `:text-matches("${escape(pattern)}", "${flags}")`,
    `pattern like "${pattern}"`,
  );
};

export const alt: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[alt="${value}"]`, `alt text "${value}"`);

export const href: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[href="${escape(value)}"]`, `href="${value}"`);

export const src: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[src="${escape(value)}"]`, `src="${value}"`);

export const ariaLabel: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[aria-label="${escape(value)}"]`, `arial label "${value}"`);

export const placeholder: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(
    `[placeholder="${escape(value)}"]`,
    `placeholder "${value}"`,
  );

export const title: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[title="${escape(value)}"]`, `title "${value}"`);

export const attr = (
  name: string,
  value?: string,
  tag?: string,
  equals: string = '=',
): FindQuery => {
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

export const id: SelectModifier = (value: string): FindQuery =>
  FindQuery.create(`[id="${escape(value)}"]`, `id="${value}"`);
