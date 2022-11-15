import { FindQuery } from './';

export interface SelectFilter {
  apply(previous: FindQuery): FindQuery;
}

export interface SelectPrimary {
  toPrimarySelector(): FindQuery;
  apply(previous: FindQuery): FindQuery;
}
