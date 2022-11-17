import { StateSelector } from './';

export const banner = new StateSelector(
  'is([role="banner"], header):visible',
  'banner',
);
export const dialog = new StateSelector(
  'is([role="dialog"], [role="alertdialog"], dialog, .modal-dialog, .modal, .dialog, [uk-modal]):visible',
  'dialog',
);

export const heading = new StateSelector(
  'is(h1, h2, h3, h4, h5, h6, [role="heading"], legend):visible',
  'heading',
);

export const main = new StateSelector(
  'is(.main, #main, main, [role="main"]):visible',
  'header',
);

export const nav = new StateSelector(
  'is(.nav, #nav, nav, [role="navigation"], .navbar, .pure-menu, [uk-navbar]):visible',
  'header',
);

export const strong = new StateSelector(
  'is([role="strong"], strong, b, big, dd, mark):visible',
  'bold',
);

export const image = new StateSelector(
  'is(img, svg, picture, [role="img"]):visible',
  'image',
);

export const link = new StateSelector(
  'is(:any-link, a[href], [role="link"]):visible',
  'link',
);

export const textbox = new StateSelector(
  'is([role="textbox"], input[type="text"], input[type="email"], input[type="tel"], input[type="search"], input[type="password"], input[type="url"]):visible',
  'textbox',
);

export const dateSelector = new StateSelector(
  'is([input[type="date"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"], input[type="dateime"]):visible',
  'date selector',
);

export const fileSelector = new StateSelector(
  'is([input[type="file"]):visible',
  'file selector',
);

export const colorPicker = new StateSelector(
  'is([input[type="color"]):visible',
  'color selector',
);

export const dropdown = new StateSelector(
  'is(select, [role="combobox"]):visible',
  'dropdown',
);

export const checkbox = new StateSelector(
  'is(input[type="checkbox"], [role="checkbox"], .checkbox):visible',
  'checkbox',
);

export const radio = new StateSelector(
  'is(input[type="radio"], [role="radio"], .radio):visible',
  'radio box',
);

export const button = new StateSelector(
  'is(button, [role="button"], input[type="button"], input[type="submit"], input[type="image"], input[type="reset"], .button, .btn, [role="button"], .pure-button, .uk-button):visible',
  'button',
);

export const form = new StateSelector(
  'is(form, [role="form"]):visible',
  'form',
);

export const region = new StateSelector(
  'is(section, fieldset, [role="region"]):visible',
  'section',
);

export const listItem = new StateSelector(
  'is(li, [role="listitem"]):visible',
  'list item',
);

export const table = new StateSelector(
  'is(table, [role="table"]):visible',
  'table',
);

export const row = new StateSelector('is(tr, [role="row"]):visible', 'table');
export const cell = new StateSelector('is(td, [role="cell"]):visible', 'table');

const psuedoMapper: { [psuedo: string]: StateSelector } = {
  button,
  link,
  image,
};

export const extractPseudoPrefix = (selector: string) => {
  const matches = selector.match(/^(:[a-z][^ ]+)/);
  if (!matches) return null;
  const pseudo = matches[1].substring(1);
  if (psuedoMapper[pseudo]) return psuedoMapper[pseudo];
  return null;
};
