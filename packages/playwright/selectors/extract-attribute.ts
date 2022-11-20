import { ExtractedText, extractText } from './extract-text';

export interface AttributeSelector {
  tag: string | null;
  attribute: string;
  value: ExtractedText | string | null;
}

export const extractAttribute = (
  selector: string,
): AttributeSelector | null => {
  const matches = selector.match(
    /^([a-z][a-z0-9-_]*)? ?@ ?([a-z][a-z0-9-_]*) ?=? ?(.*)?$/i,
  );
  if (matches) {
    const tag = matches[1] || null;
    const attribute = matches[2] || null;
    const value = matches[3] || null;
    if (attribute) {
      return {
        tag,
        attribute,
        value: value ? extractText(value) || value : null,
      };
    }
  }
  return null;
};
