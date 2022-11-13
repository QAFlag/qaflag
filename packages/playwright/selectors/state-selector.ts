import { SelectFilter, FindQuery } from './';
import { ucfirst } from '@qaflag/core';

export class StateSelector implements SelectFilter {
  constructor(private readonly state: string, private readonly name?: string) {}

  public toPrimarySelector(): FindQuery {
    return FindQuery.create(
      `:${this.state}`,
      `${ucfirst(this.name || this.state)}`,
    );
  }

  public apply(primarySelector: FindQuery): FindQuery {
    return FindQuery.create(
      `${primarySelector.selector}:${this.state}`,
      `${primarySelector.name} (${this.name || this.state})`,
    );
  }
}

export const visible = new StateSelector('visible');
export const hidden = new StateSelector('hidden');
export const readOnly = new StateSelector('read-only');
export const enabled = new StateSelector('enabled');
export const disabled = new StateSelector('disabled');
export const firstChild = new StateSelector('first-child', 'first child');
export const firstOfType = new StateSelector('first-of-type', 'first');
export const active = new StateSelector('active');
export const focus = new StateSelector('focus');
export const empty = new StateSelector('empty');
export const checked = new StateSelector('checked');
export const fullscreen = new StateSelector('fullscreen');
export const indeterminate = new StateSelector('indeterminate');
export const invalid = new StateSelector('invalid');
export const lastChild = new StateSelector('last-child', 'last child');
export const lastofType = new StateSelector('last-of-type', 'last');
export const only = new StateSelector('only-of-type', 'only');
export const onlyChild = new StateSelector('only-child', 'only child');
export const optional = new StateSelector('optional');
export const readWrite = new StateSelector('read-write');
export const required = new StateSelector('required');
export const defaultInput = new StateSelector('default');
