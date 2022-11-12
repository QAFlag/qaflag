import FindQuery from './find-query';
import { StateSelector } from './state-selector';

export const field = new StateSelector(
  'is(input, select, option, textarea):not(input[type="hidden"])',
  'form field',
);
export const button = new StateSelector(
  'is(button, input[type="button"], input[type="submit"], input[type="reset"], a.button, [role="button"])',
  'button',
);
export const header = new StateSelector('is(h1, h2, h3, h4, h5, h6)', 'header');
export const bold = new StateSelector(
  'is(h1, h2, h3, h4, h5, h6, b, strong)',
  'bold',
);

export const image = new StateSelector('is(img, svg)', 'image');

export const link = new StateSelector('is(:any-link, [role="link"])', 'link');

export const top = FindQuery.create('head', 'top of page');

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
