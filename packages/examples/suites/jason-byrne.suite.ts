import { Scenario, Suite } from '@qaflag/core';
import {
  contains,
  near,
  PlaywrightContext,
  PlaywrightScenario,
  text,
  visible,
  within,
} from '@qaflag/playwright';

export class JasonByrneSuite extends Suite({
  title: 'Jason Byrne',
  type: PlaywrightScenario,
}) {
  @Scenario({
    uri: 'GET https://www.jasonbyrne.net',
    step: 1,
  })
  async firstScenario(context: PlaywrightContext) {
    await context.exists(text('Who am I?'), visible);
    await context.exists(text('About Me'), within('nav'));
    const experience = await context.exists(
      text('Experience'),
      near(text('About Me')),
    );
    await experience.mouse.click();
    await context
      .find(contains('Experience'), within('main'), visible)
      .must.exist();
    await context.pause(1000);
  }
}
