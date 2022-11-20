import { extractText } from './extract-text';

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
