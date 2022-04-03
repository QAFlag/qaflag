import { Theme } from 'types/theme.interface';

const DARK_GREEN = '#005500';
const LIGHT_GREEN = '#00cc00';
const DARK_RED = '#550000';
const LIGHT_RED = '#cc0000';
const WHITE = '#ffffff';
const BLACK = '#000000';
const YELLOW = '#ffff00';
const DARK_GRAY = '#777777';
const LIGHT_GRAY = '#cccccc';
const MAGENTA = '#ff00ff';

export const LightTheme: Theme = {
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
      bgColor: WHITE,
      textColor: BLACK,
    },
  },
  step: {
    bgColor: BLACK,
    textColor: YELLOW,
  },
  scenario: {
    head: {
      bgColor: DARK_GRAY,
      textColor: WHITE,
      subtextColor: LIGHT_GRAY,
    },
    content: {
      bgColor: WHITE,
      textColor: BLACK,
      subtextcolor: DARK_GRAY,
      pass: {
        marker: '✔',
        markerColor: LIGHT_GREEN,
        textColor: BLACK,
      },
      fail: {
        marker: '𐄂',
        markerColor: LIGHT_RED,
        textColor: BLACK,
      },
      optionalFail: {
        marker: '!',
        markerColor: MAGENTA,
        textColor: BLACK,
      },
    },
  },
};
