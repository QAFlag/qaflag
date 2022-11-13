import { StateSelector, FindQuery, SelectFilter } from '../selectors';

export type PrimarySelector = string | FindQuery | RegExp | StateSelector;
export type SubQueries = string | FindQuery | RegExp | SelectFilter;
