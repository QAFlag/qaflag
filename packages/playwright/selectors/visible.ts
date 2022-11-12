import SelectFilter from './select-filter';
import FindQuery from './find-query';

class VisibleSelector implements SelectFilter {
  constructor() {}

  public apply(primarySelector: FindQuery): FindQuery {
    return FindQuery.create(
      `${primarySelector.selector}:visible`,
      `${primarySelector.name} (Visible)`,
    );
  }
}

export const visible = new VisibleSelector();
