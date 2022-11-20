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
  fullscreen,
  ElementSelector,
} from './elements';

const psuedoMapper: { [psuedo: string]: ElementSelector } = {
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
  fullscreen,
};

export const extractElement = (selector: string): ElementSelector | null => {
  const matches = selector.match(/^=([a-z]+)$/i);
  if (!matches) return null;
  if (psuedoMapper[matches[1]]) return psuedoMapper[matches[1]];
  return null;
};
