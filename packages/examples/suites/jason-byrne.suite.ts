import { Scenario, Suite } from '@qaflag/core';
import { PlaywrightContext, PlaywrightScenario } from '@qaflag/playwright';

export class JasonByrneSuite extends Suite({
  title: 'Jason Byrne',
  type: PlaywrightScenario,
}) {
  @Scenario({
    uri: 'GET https://www.jasonbyrne.net',
    step: 1,
  })
  async firstScenario(context: PlaywrightContext) {
    const nav = await context.exists('header nav');
    const links = await nav.exists('li a');
    (await links.count()).must.equal(5);
    await links.find("'Experience'").mouse.click();
    await context.waitForNavigation();
    await context.exists("'Job History' >> visible=true");
    await links.find("'Projects'").mouse.click();
    await context.waitForNavigation();
    const count = await context.count("'QA Automation'");
    count.must.be.greaterThan(0);
  }
}
