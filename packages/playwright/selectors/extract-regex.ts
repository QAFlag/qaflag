import { escape } from '../utils/escape';

export const extractRegex = (selector: string) => {
  const matches = selector.match(/^\/(.*)\/([a-z]+)?$/);
  if (!matches) return null;
  return {
    pattern: matches[1],
    escapedPattern: escape(matches[1]),
    flags: matches[2] || '',
  };
};
