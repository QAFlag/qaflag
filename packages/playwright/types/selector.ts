import { PlaywrightValue } from '../models/playwright.value';
import { FindQuery, SelectFilter, SelectPrimary } from '../selectors';

export type PrimarySelector =
  | FindQuery
  | string
  | RegExp
  | SelectPrimary
  | PlaywrightValue;
export type SubQueries = string | FindQuery | RegExp | SelectFilter;
