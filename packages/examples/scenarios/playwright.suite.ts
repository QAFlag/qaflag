import { Scenario, Suite } from '@qaflag/core';
import { PlaywrightContext, PlaywrightScenario } from '@qaflag/playwright';

export class GoogleSearch extends Suite({
  title: 'Test Google Search',
  type: PlaywrightScenario,
}) {
  @Scenario({
    uri: 'GET https://www.google.com',
    statusCode: 200,
  })
  async getSearchPage(context: PlaywrightContext) {
    const button = await context.exists("text='Google Search' >> visible=true");
    const input = await context.exists("[aria-label='Search']");
    await input.keyboard.input('Jason Byrne Github');
    await button.mouse.click();
    await context.page.waitForNavigation();
    await context.exists("'Jason Byrne jasonbyrne - GitHub' >> visible=true");
  }
}
