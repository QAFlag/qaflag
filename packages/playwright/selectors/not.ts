import SelectFilter from './select-filter';
import FindQuery from './find-query';

class NotFilter implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:not(${this.input.selector})`,
      `${previous.name} but not ${this.input.name}`,
    );
  }
}

export const not = (element: string | FindQuery) =>
  new NotFilter(FindQuery.create(element));
