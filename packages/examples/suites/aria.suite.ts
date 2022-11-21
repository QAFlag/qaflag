import { After, Before, Scenario, Suite } from '@qaflag/core';
import { PlaywrightContext, PlaywrightScenario } from '@qaflag/playwright';
import { Server } from 'minikin';
import { initMinikin } from '../mocks/minikin';

export class AriaSuite extends Suite({
  title: 'Aria Tests',
  type: PlaywrightScenario,
  baseUrl: 'http://localhost:8080/',
}) {
  private server: Server;

  @Before() async startServer() {
    this.server = await initMinikin();
  }

  @After() async stopServer() {
    return this.server.close();
  }

  @Scenario({
    uri: 'GET /aria',
  })
  async testRoles(context: PlaywrightContext) {
    await context.find('#realCheckbox').must.be.checked();
    await context.find('#fakeCheckbox').must.be.checked();
    await context.find('#fakeCheckbox2').must.not.be.checked();
    await context.find('#fakeCheckbox').mouse.click();
    await context.find('#fakeCheckbox').must.not.be.checked();
    await context.find('#fakeCheckbox2').form.check(true);
    await context.find('#fakeCheckbox2').must.be.checked();
    await context.find('#dropdown').must.have.value('bar');
    await context.find('#dropdown').must.have.selectedText('BAR');
    await context
      .label('Upload')
      .form.chooseFile('./packages/examples/fixtures/logo.png');
    await context
      .find('=textbox', "placeholder='url'")
      .must.have.value('https://www.qaflag.com');
    await context.role('checkbox', 'asdf').must.have.count(1);
    await context.role('switch').must.be.checked();
    await context.role('switch').action.check(false);
    await context.role('switch').must.not.be.checked();
    await context.role('textbox', 'some-label').must.have.value('me');
    await context.role('textbox', '*some-label*').must.have.value('me');
    await context.role('button', '*Add*').exists();
  }
}
