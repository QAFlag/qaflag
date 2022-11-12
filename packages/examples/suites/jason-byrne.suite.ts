import { Scenario, Suite } from '@qaflag/core';
import {
  near,
  PlaywrightContext,
  PlaywrightScenario,
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
    await context.exists('"Who am I?"', visible);
    await context.exists('*About Me*', within('nav'));
    await context.exists(/connect/i, within('nav'));
    await context.exists('a@target');
    await context.exists('a@target="_blank"');
    await context.exists('@alt');
    await context.exists('@alt=Luna');
    const experience = await context.exists(
      'li',
      '*Experience*',
      near('*About Me*'),
    );
    await experience.mouse.click();
    await context.find('*Experience*', within('main'), visible).must.exist();
    await context.exists('*Echelon*');
    await context.pause(1000);
  }
}
