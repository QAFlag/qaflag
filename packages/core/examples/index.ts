import { ConsoleFormatter } from '../common/formatter/console';
import { UsersSuite } from './json/example';

const suite = new UsersSuite();
suite.events.once('complete').then(() => {
  ConsoleFormatter.printSuite(suite);
});
