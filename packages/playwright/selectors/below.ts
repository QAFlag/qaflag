import { SelectFilter, FindQuery } from './';

class BelowFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:below(${this.input.selector}):visible`,
      `${previous.name} below ${this.input.name}`,
    );
  }
}

export const below = (selector: string | FindQuery) =>
  new BelowFilter(FindQuery.create(selector));
