import {
  TouchScreen,
  Persona,
  Laptop,
  Chrome,
  Mac,
  Before,
} from '@qaflag/core';

export class StandardUser extends Persona(
  'John Doe',
  Laptop(),
  Mac(),
  TouchScreen(1280, 720),
  Chrome(),
) {
  @Before()
  async setup() {
    console.log('Setup Standard User');
  }
}
