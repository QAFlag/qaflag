import {
  Before,
  TouchScreen,
  HttpResponse,
  Persona,
  Laptop,
  WebBrowser,
} from '@qaflag/core';

export class StandardUser extends Persona(
  'John Doe',
  Laptop('windows'),
  TouchScreen(1280, 720),
  WebBrowser('chrome'),
) {
  @Before({
    uri: 'POST /auth',
    data: {
      email: 'someone123@gmail.com',
      password: 'foobar',
    },
  })
  authenticate(response: HttpResponse) {
    this.bearerToken = response.data.jwt;
  }
}
