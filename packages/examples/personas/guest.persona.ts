import {
  TouchScreen,
  Persona,
  WebBrowser,
  Laptop,
  Windows,
  Using,
} from '@qaflag/core';

export class GuestUser extends Persona(
  'Guest User',
  Using(Windows, Laptop),
  TouchScreen(1280, 720),
  WebBrowser('safari'),
) {}
