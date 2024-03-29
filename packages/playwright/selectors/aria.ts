import { humanReadableList } from '@qaflag/core';
import { extractText } from './extract-text';

export type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'caption'
  | 'cell'
  | 'checkbox'
  | 'code'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'deletion'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'emphasis'
  | 'feed'
  | 'figure'
  | 'form'
  | 'generic'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'insertion'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'meter'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'paragraph'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'strong'
  | 'subscript'
  | 'superscript'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'time'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem';

type RoleSelectorOptions = {
  checked?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  includeHidden?: boolean;
  level?: number;
  name?: string | RegExp;
  pressed?: boolean;
  selected?: boolean;
};

type LabelSelectorOptions = {
  exact?: boolean;
};

export class RoleSelector {
  constructor(
    public readonly role: AriaRole,
    private readonly opts: RoleSelectorOptions = {},
  ) {}

  public get selector(): string {
    return `role=${this.role}`;
  }

  public get name(): string {
    const filterNames: string[] = [];
    if (this.opts) {
      Object.entries(this.opts).forEach(filter => {
        filterNames.push(`${filter[0]}=${filter[1]}`);
      });
    }
    return filterNames.length
      ? `${this.role} (${humanReadableList(filterNames)})`
      : this.role;
  }

  public get filters(): RoleSelectorOptions {
    return this.opts || {};
  }
}

export class LabelSelector {
  constructor(
    public readonly label: string | RegExp,
    private readonly opts: LabelSelectorOptions = {},
  ) {}

  public get selector(): string {
    return `label=${this.name}`;
  }

  public get name(): string {
    const filterNames: string[] = [];
    if (this.opts) {
      Object.entries(this.opts).forEach(filter => {
        filterNames.push(`${filter[0]}=${filter[1]}`);
      });
    }
    return filterNames.length
      ? `${this.label} (${humanReadableList(filterNames)})`
      : String(this.label);
  }

  public get filters(): LabelSelectorOptions {
    return this.opts || {};
  }
}

export const role = (
  roleName: AriaRole,
  label?: string | RegExp,
): RoleSelector => {
  if (!label) return new RoleSelector(roleName);
  const opts: RoleSelectorOptions | undefined = (() => {
    if (typeof label == 'string') {
      const text = extractText(label);
      if (text === null) return { name: label };
      return { name: text?.pattern || text.value, exact: text.type == 'exact' };
    }
    return { name: label };
  })();
  return new RoleSelector(roleName, opts);
};

export const label = (labelName: string | RegExp): LabelSelector => {
  const text = typeof labelName == 'string' ? extractText(labelName) : null;
  const opts = (() => {
    if (text) return { exact: text.type == 'exact' };
    return {};
  })();
  return new LabelSelector(text?.pattern || text?.value || labelName, opts);
};
