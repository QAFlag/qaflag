import {
  BrowserSoftware,
  OperatingSystemType,
  PersonaInitOptions,
} from './persona.interface';

export const Laptop = (
  os: OperatingSystemType = 'windows',
): PersonaInitOptions => ({
  deviceType: 'laptop',
  screenSize: { width: 1920, height: 1080 },
  deviceInputs: ['mouse', 'keyboard'],
  deviceOutputs: ['screen', 'printer', 'voice'],
  os: {
    type: os,
  },
});

export const SmartPhone = (osType?: 'android' | 'ios'): PersonaInitOptions => ({
  deviceType: 'phone',
  screenSize: { width: 926, height: 428 },
  deviceInputs: ['touch', 'keyboard'],
  deviceOutputs: ['screen', 'voice'],
  os: { type: osType },
});

export const TouchScreen = (
  width: number,
  height: number,
): PersonaInitOptions => ({
  deviceInputs: ['touch'],
  ...Screen(width, height),
});

export const Screen = (width: number, height: number): PersonaInitOptions => ({
  deviceOutputs: ['screen'],
  screenSize: { width, height },
});

export const WebBrowser = (product: BrowserSoftware): PersonaInitOptions => ({
  browser: {
    product,
  },
});

export const OperatingSystem = (
  type: OperatingSystemType,
): PersonaInitOptions => ({
  os: {
    type,
  },
});

export const Portrait = (): PersonaInitOptions => ({
  isPortraitMode: true,
});

export const Landscape = (): PersonaInitOptions => ({
  isPortraitMode: false,
});
