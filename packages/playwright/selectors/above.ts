import { SelectFilter, FindQuery } from './';

class AboveFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:above(${this.input.selector}):visible`,
      `${previous.name} above ${this.input.name}`,
    );
  }
}

export const above = (selector: string | FindQuery) =>
  new AboveFilter(FindQuery.create(selector));
