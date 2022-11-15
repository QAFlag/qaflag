import { FindQuery, SelectFilter, SelectPrimary } from '../selectors';

export type PrimarySelector = string | FindQuery | RegExp | SelectPrimary;
export type SubQueries = string | FindQuery | RegExp | SelectFilter;
