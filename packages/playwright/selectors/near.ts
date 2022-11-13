import SelectFilter from './select-filter';
import FindQuery from './find-query';

class NearFilter implements SelectFilter {
  constructor(
    public readonly input: FindQuery,
    private readonly maxDistance: number = 50,
  ) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:near(${this.input.selector}, ${this.maxDistance})`,
      `${previous.name} near ${this.input.name}`,
    );
  }
}

export const near = (closeTo: string | FindQuery, maxDistance: number = 50) =>
  new NearFilter(FindQuery.create(closeTo), maxDistance);

export const beside = (closeTo: string | FindQuery, maxDistance: number = 5) =>
  new NearFilter(FindQuery.create(closeTo), maxDistance);
