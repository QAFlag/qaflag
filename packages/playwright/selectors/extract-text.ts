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
  flags: string;
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
    selector.match(/^(')(.*)(')$/) || // Exact: single quote
    selector.match(/^(")(.*)(")$/) || // Exact: double-quote
    selector.match(/^(\*)(.*)(\*)$/) || // Contains: *....*
    selector.match(/^(\*)(.*)(\$)([a-z]+)$/) || // Ends with: *....$
    selector.match(/^(\/)(.*)(\/)([a-z]+)?$/) || // Custom regex: /..../
    selector.match(/^(\^)(.*)(\*)([a-z]+)$/); // Starts with: ^....*
  if (!match) return null;
  const firstQuote = match[1];
  const value = match[2];
  const lastQuote = match[3];
  const flags = match[4] || 'i';
  const type = (() => {
    if (['"', "'"].includes(firstQuote)) return 'exact';
    if (firstQuote == '/') return 'custom';
    if (firstQuote == '^') return 'startsWith';
    if (lastQuote == '$') return 'endsWith';
    return 'contains';
  })();
  const pattern = (() => {
    if (['contains', 'exact'].includes(type)) return null;
    if (type == 'startsWith') return new RegExp(`^${value}`, flags);
    if (type == 'endsWith') return new RegExp(`${value}$`, flags);
    return new RegExp(value, flags);
  })();
  return {
    value,
    pattern,
    type,
    flags,
    equalSign: EqualSignMap[type],
  };
};
