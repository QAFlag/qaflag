import SelectFilter from './select-filter';
import FindQuery from './find-query';

class LeftOfFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:left-of(${this.input.selector})`,
      `${previous.name} left of ${this.input.name}`,
    );
  }
}

export const leftOf = (selector: string | FindQuery) =>
  new LeftOfFilter(FindQuery.create(selector));
