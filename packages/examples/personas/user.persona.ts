import {
  TouchScreen,
  Persona,
  Laptop,
  WebBrowser,
  Windows,
  Using,
} from '@qaflag/core';

export class StandardUser extends Persona(
  'John Doe',
  Using(Windows, Laptop),
  TouchScreen(1280, 720),
  WebBrowser('chrome'),
) {}
