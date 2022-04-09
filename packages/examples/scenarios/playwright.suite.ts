import { Scenario, Suite } from '@qaflag/core';
import { PlaywrightContext, PlaywrightScenario } from '@qaflag/playwright';

export class GoogleSearch extends Suite(PlaywrightScenario, {
  title: 'Test Google Search',
}) {
  @Scenario({
    uri: 'GET https://www.google.com',
    statusCode: 200,
  })
  async getSearchPage(context: PlaywrightContext) {
    const button = await context.exists("text='Google Search' >> visible=true");
    const input = await context.exists("[aria-label='Search']");
    await input.$.type('Jason Byrne Github');
    await button.$.click();
    await context.page.waitForNavigation();
    await context.exists("'Jason Byrne jasonbyrne - GitHub' >> visible=true");
  }
}
