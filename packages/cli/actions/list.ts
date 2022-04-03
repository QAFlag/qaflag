import { printHeader, printList } from '../utils/print';
import { findSuites } from '../utils/find-suites';
import Project from '../models/project';

export const list = (project: Project) => {
  const suites = findSuites(project);
  printHeader();
  printList(
    Object.values(suites.suiteClasses).map(
      suite => `${suite.className} - ${suite.relativePath}`,
    ),
  );
};
