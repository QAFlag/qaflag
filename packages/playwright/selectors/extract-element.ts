import { StateSelector } from './state-selector';
import {
  form,
  button,
  dropdown,
  textbox,
  dateInput,
  colorInput,
  fileInput,
  numberInput,
  slider,
  spinbutton,
  searchbox,
  table,
  row,
  cell,
  listItem,
  region,
  link,
  image,
  dialog,
  banner,
  heading,
  main,
  nav,
  strong,
} from './elements';

const psuedoMapper: { [psuedo: string]: StateSelector } = {
  form,
  button,
  dropdown,
  textbox,
  dateInput,
  colorInput,
  fileInput,
  numberInput,
  slider,
  spinbutton,
  searchbox,
  table,
  row,
  cell,
  listItem,
  region,
  link,
  image,
  dialog,
  banner,
  heading,
  main,
  nav,
  strong,
};

export const extractElement = (selector: string): StateSelector | null => {
  const matches = selector.match(/^=([a-z]+)$/i);
  if (!matches) return null;
  if (psuedoMapper[matches[1]]) return psuedoMapper[matches[1]];
  return null;
};
