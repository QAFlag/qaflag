import { Scenario, Suite } from '@qaflag/core';
import {
  ariaLabel,
  button,
  near,
  PlaywrightContext,
  PlaywrightScenario,
  textbox,
  top,
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
    const searchButton = await context.visible(button, '"Google Search"');
    const searchInput = context.find(textbox, ariaLabel('Search'));
    context.exists(button, near('head'));
    await searchInput.must.exist();
    await searchInput.must.be.visible();
    await searchInput.must.not.be.hidden();
    await searchInput.must.all.be.visible();
    await searchInput.must.not.have.any.be.hidden();
    await searchInput.must.have.tagName('input');
    await searchInput.keyboard.input(searchTerm);
    await searchInput.must.be.in.focus();
    await searchButton.mouse.click();
    await context.waitForNavigation();
    await context.find("'Jason Byrne jasonbyrne - GitHub'", visible).exists();
    context.exists(textbox, near(top));
    const value = await searchInput.first.form.value();
    value.must.equal(searchTerm);
  }
}
