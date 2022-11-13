import { FindQuery } from './';

export interface SelectFilter {
  apply(previous: FindQuery): FindQuery;
}
