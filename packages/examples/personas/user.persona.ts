import {
  Authenticate,
  HttpResponse,
  UsingLaptop,
  Persona,
  Viewport,
  WithTouchScreen,
} from '@qaflag/core';

export class StandardUserPersona extends Persona('John Doe', {
  ...UsingLaptop,
  ...WithTouchScreen,
  ...Viewport(1280, 720),
}) {
  @Authenticate({
    uri: 'POST /auth',
  })
  async login(response: HttpResponse) {}
}
