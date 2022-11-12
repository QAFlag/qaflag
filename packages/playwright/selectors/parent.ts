import SelectFilter from './select-filter';
import FindQuery from './find-query';

class ParentFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${this.input.selector} > ${previous.selector}`,
      `${previous.name} with parent ${this.input.name}`,
    );
  }
}

export const parent = (selector: string | FindQuery) =>
  new ParentFilter(FindQuery.create(selector));
