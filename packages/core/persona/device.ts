import { PersonaInterface } from './persona.interface';

export const UsingLaptop: Partial<PersonaInterface> = {
  device: 'laptop',
  screenSize: { width: 1920, height: 1080 },
  hasMouse: true,
  hasKeyboard: true,
};

export const SmartPhone: Partial<PersonaInterface> = {
  device: 'phone',
  screenSize: { width: 428, height: 926 },
  hasTouch: true,
  hasKeyboard: true,
};

export const WithTouchScreen = {
  hasTouch: true,
};

export const Viewport = (width: number, height: number) => ({
  viewport: { width, height },
});

export const ScreenSize = (width: number, height: number) => ({
  viewport: { width, height },
});
