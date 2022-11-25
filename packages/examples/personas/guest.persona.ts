import { Before, Laptop, Persona } from '@qaflag/core';

export class GuestUser extends Persona('Guest User', Laptop()) {
  @Before()
  async setup() {
    console.log('setup Guest User');
  }
}
