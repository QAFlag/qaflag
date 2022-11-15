import { printLines } from '../../utils/print';
import Project from '../../models/project';
import { humanReadableList } from '@qaflag/core';
import { resolve, sep } from 'path';
import { cwd } from 'process';
import camelcase = require('camelcase');
import { writeFile } from 'fs-extra';
import { whichInstalled } from '../../utils/is-installed';
import { titleize } from '@qaflag/core';

const getFilePath = (project: Project, name: string, suffix: string) => {
  return resolve(cwd(), project.settings.input.path, `${name}.${suffix}.ts`);
};

const getClassNameFromPath = (path: string) =>
  camelcase(path.split(sep).pop() || '', {
    pascalCase: true,
  });

const generateSuite = (project: Project, name: string) => {
  const type = whichInstalled(['json', 'playwright', 'html', 'xml']) || 'json';
  const typeName = titleize(type);
  const filePath = getFilePath(project, name, 'suite');
  const className = getClassNameFromPath(name);
  const title = titleize(className).replace("'", '');
  printLines([`Generating suite ${filePath}`]);
  writeFile(
    filePath,
    `
import { Scenario, Suite } from '@qaflag/core';
import { ${typeName}Context, ${typeName}Scenario } from '@qaflag/${type}';

export class ${className}Suite extends Suite({
  title: '${title}',
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
  const filePath = getFilePath(project, name, 'persona');
  const className = getClassNameFromPath(name);
  const title = titleize(className).replace("'", '');
  printLines([`Generate persona ${filePath}`]);
  writeFile(
    filePath,
    `
import { Persona, Windows, Laptop, Chrome } from "@qaflag/core";

export class ${className}Persona extends Persona(
  '${title}',
  Windows(),
  Laptop(),
  Chrome(),
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
    return;
  }
  await generators[schematic](project, name);
};
