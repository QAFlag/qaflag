import {
  extractAttribute,
  extractPrefix,
  extractRegex,
  extractText,
} from './is-prefixed';
import {
  alt,
  text,
  href,
  src,
  placeholder,
  id,
  textPrefix,
  attr,
  matches,
  contains,
  SelectFilter,
  StateSelector,
  SelectModifier,
  SelectPrimary,
} from './';
import { PrimarySelector, SubQueries } from '../types';
import { selectors } from 'playwright';

const prefixMapper: { [prefix: string]: SelectModifier } = {
  alt,
  text: textPrefix,
  href,
  src,
  placeholder,
  id,
};

const isSelectPrimary = (selector: unknown): selector is SelectPrimary => {
  return !!selectors['toPrimarySelector'];
};

export class FindQuery {
  public static process(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ): FindQuery {
    const inputQuery: FindQuery = FindQuery.create(
      selector instanceof RegExp
        ? String(selector)
        : isSelectPrimary(selector)
        ? selector.toPrimarySelector()
        : selector,
    );
    return inputQuery.apply(subQueries);
  }

  public static create(input: PrimarySelector, name?: string): FindQuery {
    // Already a find query? Leave it alone
    if (typeof input !== 'string') {
      if (input instanceof FindQuery) return input;
      if (input instanceof StateSelector) return input.toPrimarySelector();
      if (input instanceof RegExp) return new FindQuery(String(input), name);
      if (isSelectPrimary(input)) return input.toPrimarySelector();
      return new FindQuery(input.selector, input.name);
    }
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
    return new FindQuery(input, name);
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
    if (query.selector.match(/^[[:]/i)) {
      return new FindQuery(
        `${this.selector}${query.selector}`,
        this.name + ' with ' + query.name,
      );
    }
    return new FindQuery(
      `${this.selector} ${query.selector}`,
      this.name + ' ' + query.name,
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
