import { mock, Scenario, Suite } from '@qaflag/core';
import { XmlResponse, XmlScenario } from '@qaflag/xml';
import { readFileSync } from 'fs';
import path = require('path');
import { GuestPersona } from '../personas/guest.persona';

mock
  .onGet('http://localhost/music')
  .reply(
    200,
    readFileSync(path.resolve(__dirname, '../../fixtures/cd-list.xml'), 'utf8'),
    {},
  );

export class XmlMusicSuite extends Suite(XmlScenario, {
  title: 'Test XML Scenario',
  persona: GuestPersona,
}) {
  @Scenario({
    uri: 'GET http://localhost/music',
    statusCode: 200,
  })
  async getListOfCds(response: XmlResponse) {
    response.find('cd title').text.is.equalTo('Empire Burlesque');
  }
}
