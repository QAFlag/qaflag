import { After, Before, Scenario, Suite } from '@qaflag/core';
import {
  label,
  PlaywrightContext,
  PlaywrightScenario,
  role,
} from '@qaflag/playwright';
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
    const count = await context.find(role('checkbox', 'asdf')).count();
    count.must.equal(1);
    await context.find(role('switch')).must.be.checked();
    await context.find(role('switch')).action.check(false);
    await context.find(role('switch')).must.not.be.checked();
    await context
      .find(label('Upload'))
      .form.file('./packages/examples/fixtures/logo.png');
    await context
      .find('=textbox', "placeholder='url'")
      .must.have.value('https://www.qaflag.com');
  }
}
