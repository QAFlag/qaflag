import { escape } from '../utils/escape';

export const extractText = (selector: string) => {
  const matches =
    selector.match(/^(')(.*)(')$/) ||
    selector.match(/^(")(.*)(")$/) ||
    selector.match(/^(\*)(.*)(\*)$/);
  if (!matches) return null;
  return {
    text: matches[2],
    escapedText: escape(matches[2]),
    exact: matches[1] !== '*',
  };
};
