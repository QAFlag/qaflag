import { printHeader, printList } from '../utils/print';
import { findSuites } from '../utils/find-suites';

export const list = () => {
  const suites = findSuites();
  printHeader();
  printList(
    Object.values(suites.suiteClasses).map(
      suite => `${suite.className} - ${suite.relativePath}`,
    ),
  );
};
