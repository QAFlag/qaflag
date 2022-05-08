import { Theme } from 'types/theme.interface';

const DARK_GREEN = '#005500';
const LIGHT_GREEN = '#00cc00';
const DARK_RED = '#550000';
const LIGHT_RED = '#ff0000';
const WHITE = '#ffffff';
const BLACK = '#000000';
const YELLOW = '#ffff00';
const DARK_GRAY = '#333333';
const LIGHT_GRAY = '#bbbbbb';
const MAGENTA = '#ff00ff';
const LIGHT_BLUE = '#ccccff';
//const ROYAL_BLUE = '#0000ff';
//const DARK_BLUE = '#0000aa';

export const DarkTheme: Theme = {
  suite: {
    pass: {
      bgColor: DARK_GREEN,
      textColor: WHITE,
      subtextColor: WHITE,
    },
    fail: {
      bgColor: DARK_RED,
      textColor: WHITE,
    },
    content: {
      bgColor: DARK_GRAY,
      textColor: WHITE,
    },
  },
  step: {
    bgColor: BLACK,
    textColor: YELLOW,
  },
  scenario: {
    head: {
      bgColor: LIGHT_GRAY,
      textColor: BLACK,
      subtextColor: DARK_GRAY,
    },
    content: {
      bgColor: DARK_GRAY,
      textColor: WHITE,
      subtextcolor: LIGHT_GRAY,
      action: {
        marker: ' ',
        pillBackgroundColor: LIGHT_BLUE,
        pillTextColor: BLACK,
        markerColor: BLACK,
        textColor: LIGHT_GRAY,
      },
      pass: {
        marker: '✔',
        markerColor: LIGHT_GREEN,
        textColor: WHITE,
      },
      fail: {
        marker: '𐄂',
        markerColor: LIGHT_RED,
        textColor: WHITE,
      },
      optionalFail: {
        marker: '!',
        markerColor: MAGENTA,
        textColor: WHITE,
      },
    },
  },
};
