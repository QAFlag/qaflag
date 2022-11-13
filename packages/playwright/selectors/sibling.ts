import { SelectFilter, FindQuery } from './';

class SiblingFilter implements SelectFilter {
  constructor(
    public readonly input: FindQuery,
    private readonly separator: string,
  ) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${this.input.selector} ${this.separator} ${previous.selector}`,
      `${this.input.name} with sibling ${previous.name}`,
    );
  }
}

export const sibling = (selector: string | FindQuery) =>
  new SiblingFilter(FindQuery.create(selector), '~');

export const previousSibling = (selector: string | FindQuery) =>
  new SiblingFilter(FindQuery.create(selector), '+');
