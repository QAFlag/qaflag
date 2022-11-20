import { FindQuery } from './';

export interface SelectFilter {
  apply(previous: FindQuery): FindQuery;
}

export interface SelectPrimary extends SelectFilter {
  toPrimarySelector(): FindQuery;
}
