import { ucfirst } from '@qaflag/core';
import { FindQuery } from './find-query';
import { SelectFilter, SelectPrimary } from './select-filter';

export class ElementSelector implements SelectFilter, SelectPrimary {
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

export const banner = new ElementSelector(
  'is([role="banner"], header):visible',
  'banner',
);
export const dialog = new ElementSelector(
  'is([role="dialog"], [role="alertdialog"], dialog, .modal-dialog, .modal, .dialog, [uk-modal]):visible',
  'dialog',
);

export const heading = new ElementSelector(
  'is(h1, h2, h3, h4, h5, h6, [role="heading"], legend):visible',
  'heading',
);

export const main = new ElementSelector(
  'is(.main, #main, main, [role="main"]):visible',
  'header',
);

export const nav = new ElementSelector(
  'is(.nav, #nav, nav, [role="navigation"], .navbar, .pure-menu, [uk-navbar]):visible',
  'header',
);

export const strong = new ElementSelector(
  'is([role="strong"], strong, b, big, dd, mark):visible',
  'bold',
);

export const image = new ElementSelector(
  'is(img, svg, picture, [role="img"]):visible',
  'image',
);

export const link = new ElementSelector(
  'is(:any-link, a[href], [role="link"]):visible',
  'link',
);

export const textbox = new ElementSelector(
  'is([role="textbox"], input[type="text"], textarea, input[type="email"], input[type="tel"], input[type="search"], input[type="password"], input[type="url"]):visible',
  'textbox',
);

export const dateInput = new ElementSelector(
  'is(input[type="date", input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"], input[type="dateime"]):visible',
  'date selector',
);

export const searchbox = new ElementSelector(
  'is(input[type="search"], [role="searchbox"])',
  'spin button',
);

export const spinbutton = new ElementSelector(
  'is(input[type="number"], [role="spinbutton"])',
  'spin button',
);

export const slider = new ElementSelector(
  'is(input[type="range"], [role="slider"])',
  'spin button',
);

export const numberInput = new ElementSelector(
  'is(input[type="number"])',
  'number input',
);

export const fileInput = new ElementSelector(
  'is(input[type="file"])',
  'file selector',
);

export const colorInput = new ElementSelector(
  'is([input[type="color"]):visible',
  'color selector',
);

export const dropdown = new ElementSelector(
  'is(select, [role="combobox"]):visible',
  'dropdown',
);

export const checkbox = new ElementSelector(
  'is(input[type="checkbox"], [role="checkbox"], .checkbox):visible',
  'checkbox',
);

export const radio = new ElementSelector(
  'is(input[type="radio"], [role="radio"], .radio):visible',
  'radio box',
);

export const button = new ElementSelector(
  'is(button, [role="button"], input[type="button"], input[type="submit"], input[type="image"], input[type="reset"], .button, .btn, [role="button"], .pure-button, .uk-button):visible',
  'button',
);

export const form = new ElementSelector(
  'is(form, [role="form"]):visible',
  'form',
);

export const region = new ElementSelector(
  'is(section, fieldset, [role="region"]):visible',
  'section',
);

export const listItem = new ElementSelector(
  'is(li, [role="listitem"]):visible',
  'list item',
);

export const table = new ElementSelector(
  'is(table, [role="table"]):visible',
  'table',
);

export const row = new ElementSelector('is(tr, [role="row"]):visible', 'table');
export const cell = new ElementSelector(
  'is(td, [role="cell"]):visible',
  'table',
);

export const fullscreen = new ElementSelector('fullscreen');
