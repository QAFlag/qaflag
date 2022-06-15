import { TouchScreen, Persona, Laptop, Chrome, Mac } from '@qaflag/core';

export class StandardUser extends Persona(
  'John Doe',
  Laptop(),
  Mac(),
  TouchScreen(1280, 720),
  Chrome(),
) {}
