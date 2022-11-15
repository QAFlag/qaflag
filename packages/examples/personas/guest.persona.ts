import { Laptop, Persona } from '@qaflag/core';

export class GuestUser extends Persona('Guest User', Laptop()) {
  public foo() {}
}
