import { PlaywrightValue } from '../models/playwright.value';
import { SelectFilter, FindQuery } from '.';

class ProximityFilter implements SelectFilter {
  public static create(
    direction: string,
    element: string | FindQuery | PlaywrightValue,
  ) {
    return new ProximityFilter(
      direction,
      FindQuery.create(
        element instanceof PlaywrightValue ? element.selector : element,
      ),
    );
  }

  constructor(
    public readonly direction: string,
    public readonly input: FindQuery,
  ) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:${this.direction}(${this.input.selector}):visible`,
      `${previous.name} ${this.direction.replace('-', ' ')} ${this.input.name}`,
    );
  }
}

class NearFilter implements SelectFilter {
  public static create(
    element: string | FindQuery | PlaywrightValue,
    maxDistance: number,
  ) {
    return new NearFilter(
      FindQuery.create(
        element instanceof PlaywrightValue ? element.selector : element,
      ),
      maxDistance,
    );
  }

  constructor(
    public readonly input: FindQuery,
    private readonly maxDistance: number = 50,
  ) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${previous.selector}:near(${this.input.selector}, ${this.maxDistance}):visible`,
      `${previous.name} near ${this.input.name}`,
    );
  }
}

export const near = (
  element: string | FindQuery | PlaywrightValue,
  maxDistance: number = 50,
) => NearFilter.create(element, maxDistance);

export const by = (
  element: string | FindQuery | PlaywrightValue,
  maxDistance: number = 3,
) => NearFilter.create(element, maxDistance);

export const above = (element: string | FindQuery | PlaywrightValue) =>
  ProximityFilter.create('above', element);

export const below = (element: string | FindQuery | PlaywrightValue) =>
  ProximityFilter.create('below', element);

export const leftOf = (element: string | FindQuery | PlaywrightValue) =>
  ProximityFilter.create('left-of', element);

export const rightOf = (element: string | FindQuery | PlaywrightValue) =>
  ProximityFilter.create('right-of', element);
