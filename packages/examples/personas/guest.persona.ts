import { TouchScreen, Persona, Laptop, WebBrowser } from '@qaflag/core';

export class GuestUser extends Persona(
  'Guest User',
  Laptop('mac'),
  TouchScreen(1280, 720),
  WebBrowser('safari'),
) {}
