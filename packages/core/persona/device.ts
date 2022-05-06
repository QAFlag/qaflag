import {
  BrowserSoftware,
  DeviceInput,
  DeviceOutput,
  DeviceType,
  PersonaOperatingSystem,
  PersonaInitOptions,
} from './persona.interface';

const defaultScreenSize: { [key in DeviceType]: [number, number] } = {
  laptop: [1920, 1080],
  desktop: [1920, 1080],
  tv: [3840, 2160],
  phone: [926, 428],
  tablet: [1024, 768],
  speaker: [0, 0],
};

const defaultInputs: { [key in DeviceType]: DeviceInput[] } = {
  laptop: ['mouse', 'keyboard'],
  desktop: ['mouse', 'keyboard'],
  tv: ['remote'],
  phone: ['touch', 'keyboard'],
  tablet: ['touch', 'keyboard'],
  speaker: ['voice'],
};

const defaultOutputs: { [key in DeviceType]: DeviceOutput[] } = {
  laptop: ['screen', 'printer', 'voice'],
  desktop: ['screen', 'printer', 'voice'],
  tv: ['screen', 'voice'],
  phone: ['screen', 'voice'],
  tablet: ['screen', 'voice'],
  speaker: ['voice'],
};

type DeviceParams = Pick<
  PersonaInitOptions,
  | 'screenSize'
  | 'deviceType'
  | 'deviceInputs'
  | 'deviceOutputs'
  | 'isPortraitMode'
>;

export const Phone: DeviceParams = {
  deviceType: 'phone',
  screenSize: defaultScreenSize['phone'],
  deviceInputs: defaultInputs['phone'],
  deviceOutputs: defaultOutputs['phone'],
  isPortraitMode: true,
};

export const Laptop: DeviceParams = {
  deviceType: 'laptop',
  screenSize: defaultScreenSize['laptop'],
  deviceInputs: defaultInputs['laptop'],
  deviceOutputs: defaultOutputs['laptop'],
};

export const Desktop: DeviceParams = {
  deviceType: 'desktop',
  screenSize: defaultScreenSize['desktop'],
  deviceInputs: defaultInputs['desktop'],
  deviceOutputs: defaultOutputs['desktop'],
};

export const Tablet: DeviceParams = {
  deviceType: 'tablet',
  screenSize: defaultScreenSize['tablet'],
  deviceInputs: defaultInputs['tablet'],
  deviceOutputs: defaultOutputs['tablet'],
};

export const Tv: DeviceParams = {
  deviceType: 'tv',
  screenSize: defaultScreenSize['tv'],
  deviceInputs: defaultInputs['tv'],
  deviceOutputs: defaultOutputs['tv'],
};

export const Speaker: DeviceParams = {
  deviceType: 'speaker',
  screenSize: defaultScreenSize['speaker'],
  deviceInputs: defaultInputs['speaker'],
  deviceOutputs: defaultOutputs['speaker'],
};

export const Windows: PersonaOperatingSystem = {
  type: 'windows',
};

export const Mac: PersonaOperatingSystem = {
  type: 'mac',
};

export const iOS: PersonaOperatingSystem = {
  type: 'ios',
};

export const Android: PersonaOperatingSystem = {
  type: 'android',
};

export const Landscape: PersonaInitOptions = {
  isPortraitMode: false,
};

export const Portrait: PersonaInitOptions = {
  isPortraitMode: true,
};

export const Using = (
  os: PersonaOperatingSystem,
  device: DeviceParams,
): PersonaInitOptions => ({
  ...device,
  os,
});

export const TouchScreen = (
  width: number,
  height: number,
  mode?: 'landscape' | 'portrait',
): PersonaInitOptions => ({
  deviceInputs: ['touch'],
  ...Screen(width, height, mode),
});

export const Screen = (
  width: number,
  height: number,
  mode: 'landscape' | 'portrait' = 'landscape',
): PersonaInitOptions => ({
  deviceOutputs: ['screen'],
  screenSize: [width, height],
  isPortraitMode: mode == 'portrait',
});

export const WebBrowser = (product: BrowserSoftware): PersonaInitOptions => ({
  browser: {
    product,
  },
});
