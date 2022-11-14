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
  topLeft,
} from '@qaflag/playwright';

export class JasonByrneSuite extends Suite({
  title: 'Jason Byrne',
  type: PlaywrightScenario,
  baseUrl: 'https://www.jasonbyrne.net',
}) {
  @Scenario()
  async firstScenario(context: PlaywrightContext) {
    await context.exists(image, near(topLeft));
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
    const images = await context.find('img').queryAll({ sort: ['top', 'ASC'] });
    const urls = await Promise.all(images.map(img => img.attribute('src')));
    context.debug(urls);
    const experience = await context.exists(
      'li',
      '*Experience*',
      near('*About Me*'),
    );
    await experience.mouse.click();
    await context.waitForNavigation();
    await context.exists(image, near(topLeft));
    await context.exists('"Experience"', header);
    await context.exists('*Echelon*');
    await context.pause(1000);
  }
}
