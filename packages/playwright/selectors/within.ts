import SelectFilter from './select-filter';
import FindQuery from './find-query';

class WithinSelector implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${this.input.selector} ${previous.selector}`,
      `${previous.name} within ${this.input.name}`,
    );
  }
}

export const within = (selector: string | FindQuery) =>
  new WithinSelector(FindQuery.create(selector));