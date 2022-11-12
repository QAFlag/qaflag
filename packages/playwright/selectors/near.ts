import SelectFilter from './select-filter';
import FindQuery from './find-query';

class NearSelector implements SelectFilter {
  constructor(
    public readonly input: FindQuery,
    private readonly maxDistance: number = 50,
  ) {}

  public apply(previous: FindQuery): FindQuery {
    return new FindQuery(
      `${previous.selector}:near(${this.input.selector}, ${this.maxDistance})`,
      `${previous.name} near ${this.input.name}`,
    );
  }
}

export const near = (closeTo: string | FindQuery, maxDistance: number = 50) =>
  new NearSelector(FindQuery.create(closeTo), maxDistance);
