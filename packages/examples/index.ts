import { ConsoleFormatter } from '@qaflag/core';
import { XmlMusicSuite } from './scenarios/xml.suite';
import { UsersSuite } from './scenarios/json.suite';
import { RssCnnSuite } from './scenarios/rss.suite';

const json = new UsersSuite();
json.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(json);
});

const xml = new XmlMusicSuite();
xml.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(xml);
});

const rss = new RssCnnSuite();
rss.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(rss);
});
