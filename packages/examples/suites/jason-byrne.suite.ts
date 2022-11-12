import { Scenario, Suite } from '@qaflag/core';
import {
  near,
  PlaywrightContext,
  PlaywrightScenario,
  visible,
  within,
  not,
  link,
  first,
  header,
  image,
  top,
} from '@qaflag/playwright';

export class JasonByrneSuite extends Suite({
  title: 'Jason Byrne',
  type: PlaywrightScenario,
}) {
  @Scenario({
    uri: 'GET https://www.jasonbyrne.net',
  })
  async firstScenario(context: PlaywrightContext) {
    await context.exists(image, near(top));
    await context.exists('"Who am I?"', visible);
    await context.exists('*About Me*', within('nav'));
    await context.exists(/connect/i, within('nav'));
    await context.exists('a@target');
    await context.exists('a@target="_blank"');
    await context.exists('@alt');
    await context.exists('@alt=Luna');
    await context.exists('aside', 'img');
    await context.exists('img', '@alt=Luna');
    await context.exists('img', not('@alt="Foo'));
    await context.exists('@href', link);
    await context.exists('@href', link, first);
    const experience = await context.exists(
      'li',
      '*Experience*',
      near('*About Me*'),
    );
    await experience.mouse.click();
    await context.waitForNavigation();
    await context.exists('"Experience"', header);
    await context.exists('*Echelon*');
    await context.pause(1000);
  }
}
