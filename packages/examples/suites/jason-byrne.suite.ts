import { Case, Scenario, Suite } from '@qaflag/core';
import {
  near,
  PlaywrightContext,
  PlaywrightScenario,
  within,
  not,
  topLeft,
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
    await context.exists('=image', near(topLeft));
    await context.exists('"Who am I?"', ':visible');
    await context.exists('*About Me*', within('nav'));
    await context.exists(/connect/i, within('nav'));
    await context.exists('alt=*Luna*');
    await context.exists('aside', 'img');
    await context.exists('img', 'alt=*Luna*');
    const luna = await context.exists('=image', not('alt="Foo"'));
    context.debug(await luna.image.natrualSize());
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
    const logo = context.find('=image', near(topLeft));
    await logo.must.lookLike('@logo');
  }

  @Case() async testExperiencePage(context: PlaywrightContext) {
    context.debug(this.title);
    await context.exists('=image', near(topLeft));
    await context.exists('=heading', '"Experience"');
    await context.exists('*Echelon*');
    await context
      .find('body')
      .must.have.style('backgroundColor', 'rgb(13, 14, 27)');
    await context.pause(1000);
  }
}
