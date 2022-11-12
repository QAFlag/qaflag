import FindQuery from './find-query';

export default interface SelectFilter {
  apply(previous: FindQuery): FindQuery;
}
