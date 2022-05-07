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
import { PlaywrightContext } from '@qaflag/playwright';

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

  async signIn(context: PlaywrightContext) {
    const signInButton = context.find("'Sign In'");
    const emailInput = context.find("'Email'");
    const passwordInput = context.find("'Password'");
    await emailInput.mouse.click();
    await emailInput.keyboard.input('someone123@gmail.com');
    await passwordInput.mouse.click();
    await passwordInput.keyboard.input('foobar');
    await signInButton.mouse.click();
    return context.waitForNavigation();
  }

  async goBackHome(context: PlaywrightContext) {
    const home = context.find("'Home'");
    home.mouse.click();
  }
}
