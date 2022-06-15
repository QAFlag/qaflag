import { TouchScreen, Persona, Laptop, Windows, Safari } from '@qaflag/core';

export class GuestUser extends Persona(
  'Guest User',
  Laptop(),
  Windows(),
  Safari(),
  TouchScreen(1280, 720),
) {}
