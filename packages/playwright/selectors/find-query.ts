import {
  text,
  matches,
  contains,
  SelectFilter,
  StateSelector,
  SelectPrimary,
} from './';
import { PrimarySelector, SubQueries } from '../types';
import { selectors } from 'playwright';
import { extractText } from './extract-text';
import { extractPrefix } from './extract-prefix';
import { extractElement } from './extract-element';
import { prefixMapper } from './modifiers';

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
      if (matchText.pattern) return matches(matchText.value, matchText.flags);
      if (matchText.type == 'exact') return text(matchText.value);
      return contains(matchText.value);
    }
    // Prefixed
    const matchPrefix = extractPrefix(input);
    if (matchPrefix) {
      if (prefixMapper[matchPrefix.prefix]) {
        return prefixMapper[matchPrefix.prefix](matchPrefix.selector);
      }
    }
    // Element/role matcher
    const matchElement = extractElement(input);
    if (matchElement) return matchElement.toPrimarySelector();
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
