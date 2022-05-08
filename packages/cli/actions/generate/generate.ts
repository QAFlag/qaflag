import { printLines } from '../../utils/print';
import Project from '../../models/project';
import { humanReadableList } from '@qaflag/core';
import { resolve, sep } from 'path';
import { cwd } from 'process';
import camelcase = require('camelcase');
import { writeFile } from 'fs-extra';
import { whichInstalled } from '../../utils/is-installed';
import { titleize } from '../../utils/string';

const generateSuite = (project: Project, name: string) => {
  const type = whichInstalled(['json', 'playwrite', 'html', 'xml']) || 'json';
  const typeName = titleize(type);
  const filePath = resolve(
    cwd(),
    project.settings.input.path,
    `${name}.suite.ts`,
  );
  const className = camelcase(name.split(sep).pop() || '', {
    pascalCase: true,
  });
  const title = titleize(className);
  printLines([`Generating suite ${filePath}`]);
  writeFile(
    filePath,
    `
import { Scenario, Suite } from '@qaflag/core';
import { ${typeName}Context, ${typeName}Scenario } from '@qaflag/${type}';

export class ${className}Suite extends Suite({
  title: '${title.replace("'", '')}',
  type: ${typeName}Scenario,
}) {
  @Scenario({
    uri: 'GET /path/here',
    step: 1,
  })
  async firstScenario(context: ${typeName}Context) {
    // put tests here
  }
}
  `.trim(),
  );
};

const generatePersona = (project: Project, name: string) => {
  const filePath = resolve(
    cwd(),
    project.settings.input.path,
    `${name}.persona.ts`,
  );
  const className = camelcase(name.split(sep).pop() || '', {
    pascalCase: true,
  });
  const title = titleize(className);
  printLines([`Generate persona ${filePath}`]);
  writeFile(
    filePath,
    `
import {
  Persona,
  WebBrowser,
  Laptop,
  Windows,
  Using,
} from '@qaflag/core';

export class ${className}Persona extends Persona(
  '${title.replace("'", '')}',
  Using(Windows, Laptop),
  WebBrowser('chrome'),
) {}
  `.trim(),
  );
};

const generators = {
  s: generateSuite,
  suite: generateSuite,
  p: generatePersona,
  persona: generatePersona,
};

export const generate = async (
  project: Project,
  schematic: string,
  name: string,
  options: { [key: string]: string | boolean },
) => {
  if (!generators[schematic]) {
    printLines([
      `Invalid schematic. Must be ${humanReadableList(
        Object.keys(generators),
      )}`,
    ]);
    throw `No generator for ${schematic}.`;
  }
  await generators[schematic](project, name);
};
