import { Scenario, Suite } from '@qaflag/core';
import {
  attr,
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
    const searchInput = context.find(attr('aria-label', 'Search'));
    await context.exists(button, near(top));
    await searchInput.must.exist();
    await searchInput.must.be.visible();
    await searchInput.must.not.be.hidden();
    await searchInput.must.all.be.visible();
    await searchInput.must.not.have.any.be.hidden();
    await searchInput.must.have.tagName('input');
    await searchInput.keyboard.type(searchTerm);
    await searchInput.must.be.in.focus();
    await searchButton.mouse.click();
    await context.waitForNavigation();
    await context.find("'Jason Byrne jasonbyrne - GitHub'", visible).exists();
    const newSearchBox = await context.exists(textbox, near(top));
    const value = await newSearchBox.first.form.value();
    value.must.equal(searchTerm);
    await newSearchBox.mouse.click();
    await newSearchBox.must.have.focus();
    await newSearchBox.keyboard.selectAll();
    await newSearchBox.keyboard.delete();
    (await newSearchBox.first.form.value()).must.equal('');
    await context.pause(1000);
    await newSearchBox.keyboard.type('foobar');
    await newSearchBox.form.clear();
    await context.pause(1000);
    await newSearchBox.keyboard.press('a');
    await newSearchBox.keyboard.backspace();
    await context.pause(1000);
  }
}
