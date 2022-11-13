import { SelectFilter, FindQuery } from './';
import { ordinal } from '@qaflag/core';

class NthFilter implements SelectFilter {
  constructor(public readonly index: number) {}

  public apply(previous: FindQuery): FindQuery {
    return FindQuery.create(
      `:nth-match(${previous.selector}, ${this.index})`,
      `${ordinal(this.index)} ${previous.name}`,
    );
  }
}

export const nth = (n: number) => {
  if (n === 0) throw 'nth filter is 1-based, you used 0';
  return new NthFilter(n);
};

export const first = nth(1);
