import SelectFilter from './select-filter';
import FindQuery from './find-query';

class IsSelector implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:is(${this.input.selector})`,
      `${previous.name} and is ${this.input.name}`,
    );
  }
}

export const and = (element: string | FindQuery) =>
  new IsSelector(FindQuery.create(element));
