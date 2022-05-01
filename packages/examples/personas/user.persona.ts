import {
  UsingLaptop,
  Persona,
  Viewport,
  WithTouchScreen,
  Before,
} from '@qaflag/core';

export class StandardUserPersona extends Persona('John Doe', {
  ...UsingLaptop,
  ...WithTouchScreen,
  ...Viewport(1280, 720),
}) {
  @Before()
  async login() {
    this.bearerToken = 'Foo';
  }
}
