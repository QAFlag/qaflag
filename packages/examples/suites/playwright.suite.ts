import { Scenario, Suite } from '@qaflag/core';
import { PlaywrightContext, PlaywrightScenario } from '@qaflag/playwright';

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
    const button = await context.exists("text='Google Search' >> visible=true");
    const textbox = await context.exists("[aria-label='Search']");
    await textbox.must.be.visible();
    await textbox.must.not.be.hidden();
    await textbox.must.all.be.visible();
    await textbox.must.not.have.any.be.hidden();
    await textbox.must.have.tagName('input');
    await textbox.keyboard.input(searchTerm);
    await textbox.must.be.in.focus();
    await button.mouse.click();
    await context.waitForNavigation();
    await context.exists("'Jason Byrne jasonbyrne - GitHub' >> visible=true");
    const value = await textbox.first.value();
    value.must.equal(searchTerm);
  }

  @Scenario({
    uri: 'GET /',
  })
  async testHomepage(context: PlaywrightContext) {
    const logo = await context.find('img').largest();
    const altText = await logo.attribute('alt');
    altText.must.equal('Google');
    const count = await context.getByTag(['p', 'a']).count();
    count.must.be.greaterThan(0);
    const input = await context.getClosest('input', logo);
    await input.must.exist();
    context.debug(input);
  }
}
