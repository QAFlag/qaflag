import { PrimarySelector } from '../types';
import { SelectFilter, FindQuery } from './';

class WithinSelector implements SelectFilter {
  constructor(public readonly input: FindQuery) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `${this.input.selector} ${previous.selector}`,
      `${previous.name} within ${this.input.name}`,
    );
  }
}

export const within = (selector: PrimarySelector) =>
  new WithinSelector(FindQuery.create(selector));
