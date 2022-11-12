import { isAlt } from './is-prefixed';
import { isText } from './is-text';
import { alt, text } from './modifiers';
import SelectFilter from './select-filter';

export default class FindQuery {
  public static create(input: string | FindQuery) {
    if (typeof input == 'string') {
      if (isText(input)) return text(input.substring(1, input.length - 1));
      if (isAlt(input)) return alt(input.substring(4));
      return new FindQuery(input);
    }
    return input;
  }

  constructor(
    private readonly _selector: string,
    private readonly _name?: string,
  ) {}

  public get selector() {
    return this._selector;
  }

  public get name(): string {
    return this._name || this._selector;
  }

  public next(input: FindQuery | string) {
    const query = FindQuery.create(input);
    return new FindQuery(
      `${this.selector}${query.selector}`,
      this.name + ' with ' + query.name,
    );
  }

  public apply(
    subQueries: Array<SelectFilter | string | FindQuery>,
  ): FindQuery {
    return subQueries.reduce((previous: FindQuery, current) => {
      if (typeof current == 'string' || current instanceof FindQuery) {
        return this.next(current);
      }
      return current.apply(previous);
    }, this) as FindQuery;
  }
}
