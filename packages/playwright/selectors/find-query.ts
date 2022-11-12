import {
  extractAttribute,
  extractPrefix,
  extractRegex,
  extractText,
} from './is-prefixed';
import {
  alt,
  SelectModifier,
  text,
  ariaLabel,
  role,
  href,
  src,
  placeholder,
  id,
  textPrefix,
  attr,
  matches,
  contains,
} from './modifiers';
import SelectFilter from './select-filter';

const prefixMapper: { [prefix: string]: SelectModifier } = {
  alt,
  text: textPrefix,
  ariaLabel,
  role,
  href,
  src,
  placeholder,
  id,
};

export default class FindQuery {
  public static create(input: string | FindQuery, name?: string) {
    // Already a find query? Leave it alone
    if (input instanceof FindQuery) return input;
    if (typeof name == 'string') return new FindQuery(input, name);
    // Look for quoted text
    const matchText = extractText(input);
    if (matchText) {
      if (matchText.type == '*') return contains(matchText.text);
      return text(matchText.text);
    }
    // Look for quoted text
    const matchRegex = extractRegex(input);
    if (matchRegex) return matches(matchRegex.pattern, matchRegex.flags);
    // Prefixed
    const matchPrefix = extractPrefix(input);
    if (matchPrefix && prefixMapper[matchPrefix.prefix]) {
      return prefixMapper[matchPrefix.prefix](matchPrefix.selector);
    }
    // Attribute selector
    const matchAttribute = extractAttribute(input);
    if (matchAttribute) {
      return attr(
        matchAttribute.attribute,
        matchAttribute.value,
        matchAttribute.tag,
        matchAttribute.equality,
      );
    }
    // Standard
    return new FindQuery(input);
  }

  private constructor(
    private readonly _selector: string,
    private readonly _name?: string,
  ) {}

  public get selector() {
    return this._selector;
  }

  public get name(): string {
    return this._name || this._selector;
  }

  public next(input: FindQuery | string) {
    const query = FindQuery.create(input);
    return new FindQuery(
      `${this.selector}${query.selector}`,
      this.name + ' with ' + query.name,
    );
  }

  public apply(
    subQueries: Array<SelectFilter | string | FindQuery | RegExp>,
  ): FindQuery {
    return subQueries.reduce((previous: FindQuery, current) => {
      if (current instanceof RegExp) return this.next(String(current));
      if (typeof current == 'string' || current instanceof FindQuery) {
        return this.next(current);
      }
      return current.apply(previous);
    }, this) as FindQuery;
  }
}
