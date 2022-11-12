import { Scenario, Suite } from '@qaflag/core';
import {
  ariaLabel,
  button,
  field,
  near,
  PlaywrightContext,
  PlaywrightScenario,
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
    const searchButton = await context.exists(button, '"Google Search"');
    const textbox = context.find(field, ariaLabel('Search'));
    context.exists(button, near('head'));
    await textbox.must.exist();
    await textbox.must.be.visible();
    await textbox.must.not.be.hidden();
    await textbox.must.all.be.visible();
    await textbox.must.not.have.any.be.hidden();
    await textbox.must.have.tagName('input');
    await textbox.keyboard.input(searchTerm);
    await textbox.must.be.in.focus();
    await searchButton.mouse.click();
    await context.waitForNavigation();
    await context.find("'Jason Byrne jasonbyrne - GitHub'", visible).exists();
    context.exists(field, near('head'));
    const value = await textbox.first.value();
    value.must.equal(searchTerm);
  }
}
