import { FindQuery, SelectFilter } from './';

class LeftOfFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:left-of(${this.input.selector}):visible`,
      `${previous.name} left of ${this.input.name}`,
    );
  }
}

export const leftOf = (selector: string | FindQuery) =>
  new LeftOfFilter(FindQuery.create(selector));
