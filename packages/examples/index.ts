import { ConsoleFormatter } from '@qaflag/core';
import { XmlMusicSuite } from './scenarios/xml';
import { UsersSuite } from './scenarios/json';

const json = new UsersSuite();
json.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(json);
});

const xml = new XmlMusicSuite();
xml.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(xml);
});
