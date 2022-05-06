import {
  Before,
  TouchScreen,
  HttpResponse,
  Persona,
  Laptop,
  WebBrowser,
  Windows,
  Using,
} from '@qaflag/core';

export class StandardUser extends Persona(
  'John Doe',
  Using(Windows, Laptop),
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
