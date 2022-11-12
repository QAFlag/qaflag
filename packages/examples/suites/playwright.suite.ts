import { Scenario, Suite } from '@qaflag/core';
import {
  ariaLabel,
  near,
  PlaywrightContext,
  PlaywrightScenario,
  text,
  visible,
} from '@qaflag/playwright';

export class GoogleSearch extends Suite({
  title: 'Test Google Search',
  type: PlaywrightScenario,
  baseUrl: 'https://www.google.com',
}) {
  @Scenario({
    uri: 'GET /',
  })
  async queryForMyGithub(context: PlaywrightContext) {
    const searchTerm = 'Jason Byrne Github';
    const button = await context.exists(text('Google Search'), visible);
    const textbox = context.find('input', ariaLabel('Search'));
    await textbox.must.exist();
    await textbox.must.be.visible();
    await textbox.must.not.be.hidden();
    await textbox.must.all.be.visible();
    await textbox.must.not.have.any.be.hidden();
    await textbox.must.have.tagName('input');
    await textbox.keyboard.input(searchTerm);
    await textbox.must.be.in.focus();
    await button.mouse.click();
    await context.waitForNavigation();
    await context.find("'Jason Byrne jasonbyrne - GitHub'", visible).exists();
    context.find('input', near(').logo', 200));
    const value = await textbox.first.value();
    value.must.equal(searchTerm);
  }
}
