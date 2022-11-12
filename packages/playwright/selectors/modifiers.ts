import { humanReadableList } from '@qaflag/core';
import FindQuery from './find-query';
import { isXpath } from './is-xpath';

export const xpath = (selector: string): FindQuery =>
  new FindQuery(`xpath=${selector}`, selector);

export const text = (text: string): FindQuery => {
  return new FindQuery(`:text-is("${text}")`, `"${text}"`);
};

export const contains = (text: string): FindQuery => {
  return new FindQuery(`:has-text("${text}")`, `"${text}"`);
};

export const matches = (pattern: string, flags = 'i'): FindQuery => {
  return new FindQuery(
    `:text-matches("${pattern}", "${flags}})`,
    `pattern like "${pattern}"`,
  );
};

export const alt = (selector: string): FindQuery =>
  new FindQuery(`[alt="${selector}"]`, `alt text "${selector}"`);

export const ariaLabel = (selector: string): FindQuery =>
  new FindQuery(`[aria-label="${selector}"]`, `arial label "${selector}"`);

export const placeholder = (selector: string): FindQuery =>
  new FindQuery(`[placeholder="${selector}"]`, `placeholder "${selector}"`);

export const title = (selector: string): FindQuery =>
  new FindQuery(`[title="${selector}"]`, `title "${selector}"`);

export const or = (selectors: string[]): FindQuery =>
  new FindQuery(
    isXpath(selectors[0]) ? selectors.join('|') : selectors.join(', '),
    humanReadableList(selectors, ',', 'or'),
  );
