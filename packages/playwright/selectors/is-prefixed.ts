import { escape } from '../utils/escape';

export const isPrefixed = (selector: string) => /^\*?[a-z]+=/.test(selector);

export const extractText = (selector: string) => {
  const matches =
    selector.match(/^(')(.*)(')$/) ||
    selector.match(/^(")(.*)(")$/) ||
    selector.match(/^(\*)(.*)(\*)$/);
  if (!matches) return null;
  return {
    text: matches[2],
    escapedText: escape(matches[2]),
    type: matches[1],
  };
};

export const extractRegex = (selector: string) => {
  const matches = selector.match(/^\/(.*)\/([a-z]+)?$/);
  if (!matches) return null;
  return {
    pattern: matches[1],
    escapedPattern: escape(matches[1]),
    flags: matches[2] || '',
  };
};

export const extractPrefix = (selector: string) => {
  const matches = selector.match(/^(\*?[a-z]+)=(.*)/);
  if (!matches) return null;
  return {
    prefix: matches[1],
    selector: matches[2],
  };
};

export const extractAttribute = (selector: string) => {
  const matches = selector.match(
    /^([a-z\*][^ ]*)?@([^=]+)((=|\*=|^=|~=|$=|==|\|=)(.+))?$/,
  );
  if (!matches) return null;
  const quoted = extractText(matches[5] || '');
  const value = quoted ? quoted.text : matches[5];
  const equality = (() => {
    const eq = matches[4];
    if (!eq) return undefined;
    if (eq == '==') return '=';
    if (eq == '=' && !quoted) return '*=';
    return eq;
  })();
  return {
    tag: matches[1],
    attribute: matches[2],
    equality,
    value,
  };
};
