import { printLines, printList } from '../utils/print';
import { findSuites } from '../utils/find-suites';
import Project from '../models/project';

export const list = (project: Project) => {
  const suites = findSuites(project);
  printLines([
    '',
    'List QA Flag Suites',
    '',
    `Searching in: ${project.settings.output.path}`,
    `With pattern: ${project.settings.output.pattern}`,
    '',
  ]);
  printList(
    Object.values(suites.suiteClasses).map(
      suite => `${suite.className} - ${suite.relativePath}`,
    ),
  );
};
