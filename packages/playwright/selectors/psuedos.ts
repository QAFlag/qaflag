import FindQuery from './find-query';
import { StateSelector } from './state-selector';

export const banner = new StateSelector(
  'is([role="banner"], header)',
  'banner',
);
export const dialog = new StateSelector(
  'is([role="dialog"], dialog, .modal-dialog, .modal, .dialog, [uk-modal])',
  'dialog',
);

export const heading = new StateSelector(
  'is(h1, h2, h3, h4, h5, h6, header, [role="heading"], thead, legend, hgroup)',
  'heading',
);
export const main = new StateSelector(
  'is(.main, #main, main, [role="main"])',
  'header',
);

export const nav = new StateSelector(
  'is(.nav, #nav, nav, [role="navigation"], .navbar, .pure-menu, [uk-navbar])',
  'header',
);

export const header = new StateSelector('is(h1, h2, h3, h4, h5, h6)', 'header');
export const bold = new StateSelector(
  'is(h1, h2, h3, h4, h5, h6, b, strong, big, dd, mark)',
  'bold',
);
export const image = new StateSelector('is(img, svg, picture)', 'image');
export const link = new StateSelector('is(:any-link, [role="link"])', 'link');
export const field = new StateSelector(
  'is(input, select, option, textarea):not(input[type="hidden"])',
  'form field',
);
export const textbox = new StateSelector(
  'is(input[type="text"], input[type="email"], input[type="tel"], input[type="search"], input[type="password"], input[type="url"])',
  'form field',
);
export const dropdown = new StateSelector('is(select)', 'dropdown');
export const checkbox = new StateSelector(
  'is(input[type="checkbox"])',
  'checkbox',
);
export const radio = new StateSelector('is(input[type="radio"])', 'radio box');
export const button = new StateSelector(
  'is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"], .button, .btn, [role="button"], .pure-button, .uk-button)',
  'button',
);

export const top = FindQuery.create('.qaFlagTop', 'top of page');
export const left = FindQuery.create('.qaFlagLeft', 'left of page');
export const bottom = FindQuery.create('.qaFlagBottom', 'bottom of page');
export const right = FindQuery.create('.qaFlagRight', 'right of page');
export const topLeft = FindQuery.create('.qaFlagTL', 'top left of page');
export const topRight = FindQuery.create('.qaFlagTR', 'top right of page');
export const bottomLeft = FindQuery.create('.qaFlagBL', 'bottom left of page');
export const bottomRight = FindQuery.create(
  '.qaFlagBR',
  'bottom right of page',
);

const psuedoMapper: { [psuedo: string]: StateSelector } = {
  button,
  header,
  bold,
  field,
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
