import { UsersSuite } from './json/smoke';

const suite = new UsersSuite();
suite.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(suite);
});
