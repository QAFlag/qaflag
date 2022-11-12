import SelectFilter from './select-filter';
import FindQuery from './find-query';

class HasFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:has(${this.input.selector})`,
      `${previous.name} that has ${this.input.name}`,
    );
  }
}

export const has = (selector: string | FindQuery) =>
  new HasFilter(FindQuery.create(selector));
