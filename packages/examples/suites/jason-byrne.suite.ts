import { Case, Scenario, Suite } from '@qaflag/core';
import {
  near,
  PlaywrightContext,
  PlaywrightScenario,
  visible,
  within,
  not,
  link,
  first,
  image,
  topLeft,
  heading,
} from '@qaflag/playwright';
import { GuestUser } from '../personas/guest.persona';

export class JasonByrneSuite extends Suite({
  title: 'Jason Byrne',
  type: PlaywrightScenario,
  baseUrl: 'https://www.jasonbyrne.net',
  persona: new GuestUser(),
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
    await context.case(this.testExperiencePage);
    const logo = context.find(image, near(topLeft));
    const ss = await logo.screenshot();
    const diff = await logo.screenshotDiff(ss);
    diff.must.be.lessThan(0.5);
  }

  @Case() async testExperiencePage(context: PlaywrightContext) {
    const user = context.persona as GuestUser;
    user.foo();
    context.debug(this.title);
    await context.exists(image, near(topLeft));
    await context.exists(heading, '"Experience"');
    await context.exists('*Echelon*');
    context.debug(await context.find('body').getStyle('backgroundColor'));
    await context.pause(1000);
  }
}
