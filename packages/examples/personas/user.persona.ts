import { UsingLaptop, Persona, Viewport, WithTouchScreen } from '@qaflag/core';

export class StandardUser extends Persona('John Doe', {
  ...UsingLaptop,
  ...WithTouchScreen,
  ...Viewport(1280, 720),
}) {}
