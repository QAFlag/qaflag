import { escape } from '../utils/escape';
import { FindQuery } from './';
import { extractText } from './extract-text';

export type SelectModifier = (selector: string, opt?: string) => FindQuery;

export const text: SelectModifier = (value: string): FindQuery => {
  return FindQuery.create(`:text-is("${escape(value)}")`, `"${value}"`);
};

export const contains: SelectModifier = (value: string): FindQuery => {
  return FindQuery.create(`:has-text("${escape(value)}")`, `"${value}"`);
};

export const hasText: SelectModifier = (value: string): FindQuery => {
  const extracted = extractText(value);
  if (extracted?.pattern) return matches(extracted.value, extracted.flag);
  if (extracted?.type == 'exact') return text(extracted.value);
  return contains(extracted?.value || value);
};

export const matches = (pattern: string, flags = 'i'): FindQuery => {
  return FindQuery.create(
    `:text-matches("${escape(pattern)}", "${flags}")`,
    `pattern like "${pattern}"`,
  );
};

export const attr = (name: string, text?: string, tag?: string): FindQuery => {
  const extracted = text ? extractText(text) : null;
  const equals = extracted?.equalSign || '=';
  const value = extracted?.value || text;
  const flag = extracted?.flag == 'i' ? 'i' : '';
  if (extracted?.type == 'custom') {
    throw `Attribute selectors do not support custom regex: ${tag}@${name}${equals}${value}`;
  }
  if (tag !== undefined && value !== undefined) {
    return FindQuery.create(
      `${tag}[${name}${equals}"${escape(value)}"${flag}]`,
      `${tag}@${name}${equals}"${value}"`,
    );
  }
  if (tag !== undefined) {
    return FindQuery.create(`${tag}[${name}]`, `${tag}[${name}]`);
  }
  if (value !== undefined) {
    return FindQuery.create(
      `[${name}${equals}"${escape(value)}"${flag}]`,
      `${name}${equals}"${value}"`,
    );
  }
  return FindQuery.create(`[${name}]`, `[${name}]`);
};
