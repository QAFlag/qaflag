import { Authenticate, HttpResponse, Persona } from '@qaflag/core';

export class StandardUserPersona extends Persona('John Doe', {
  story: 'John is a registered user, aged 37 and living in Orlando, FL.',
}) {
  @Authenticate({
    uri: 'POST /auth',
  })
  async login(response: HttpResponse) {}
}
