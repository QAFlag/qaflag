type ExtractedTextType =
  | 'contains'
  | 'exact'
  | 'startsWith'
  | 'endsWith'
  | 'custom';

export interface ExtractedText {
  value: string;
  pattern: RegExp | null;
  type: ExtractedTextType;
  flag: string;
  equalSign: string;
}

const EqualSignMap: { [key in ExtractedTextType]: string } = {
  contains: '*=',
  exact: '=',
  startsWith: '^=',
  endsWith: '$=',
  custom: '/=',
};

export const extractText = (selector: string): ExtractedText | null => {
  const match =
    selector.match(/^(')(.*)(') ?([is])?$/) || // Exact: single quote
    selector.match(/^(")(.*)(") ?([is])?$/) || // Exact: double-quote
    selector.match(/^(\*)(.*)(\*) ?([is])?$/) || // Contains: *....*
    selector.match(/^(\*)(.*)(\$) ?([is])?$/) || // Ends with: *....$
    selector.match(/^(\/)(.*)(\/) ?([is])?$/) || // Custom regex: /..../
    selector.match(/^(\^)(.*)(\*) ?([is])?$/); // Starts with: ^....*
  if (!match) return null;
  const firstQuote = match[1];
  const value = match[2];
  const lastQuote = match[3];
  const flag = match[4] || 'i';
  const type = (() => {
    if (['"', "'"].includes(firstQuote)) return 'exact';
    if (firstQuote == '/') return 'custom';
    if (firstQuote == '^') return 'startsWith';
    if (lastQuote == '$') return 'endsWith';
    return 'contains';
  })();
  const pattern = (() => {
    if (['contains', 'exact'].includes(type)) return null;
    if (type == 'startsWith') return new RegExp(`^${value}`, flag);
    if (type == 'endsWith') return new RegExp(`${value}$`, flag);
    return new RegExp(value, flag);
  })();
  return {
    value,
    pattern,
    type,
    flag,
    equalSign: EqualSignMap[type],
  };
};
