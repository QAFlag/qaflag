import { FindQuery, SelectFilter } from './';

class RightOfFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:right-of(${this.input.selector}):visible`,
      `${previous.name} right of ${this.input.name}`,
    );
  }
}

export const rightOf = (selector: string | FindQuery) =>
  new RightOfFilter(FindQuery.create(selector));
