#!/usr/bin/env node

import { list } from './actions/list';
import { Command } from 'commander';
import { plan } from './actions/plan';
import cli from './cli';
import Project from './models/project';
import { init } from './actions/init';
import { run } from './actions/run';
import { startServer } from './webserver/server';
import * as open from 'open';
import { build } from './actions/build';
import { generate } from './actions/generate/generate';

// Initialize Project
const project = new Project({
  configFile: process.env.QAFLAG_CONFIG_FILE,
});

// Initialize CLI
const program = new Command()
  .name('qaflag')
  .description('QA Flag test automation CLI')
  .version(cli.version, '-v, --version', 'Output the current version.')
  .usage('<command> [options]')
  .helpOption('-h, --help', 'Output usage information.')
  .showSuggestionAfterError()
  .addHelpText(
    'after',
    `

For more documentation: https://www.qaflag.com
`,
  );

program
  .command('serve')
  .alias('s')
  .description('Run the QA Flag web interface.')
  .action(async (str, options) => {
    const server = await startServer(project);
    open(`http://localhost:${server.port}`);
  });

program
  .command('list')
  .alias('l')
  .description('List available suites')
  .action((str, options) => {
    list(project);
  });

program
  .command('plan')
  .alias('p')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await plan(project);
  });

program
  .command('run')
  .alias('r')
  .description('Run a test suite')
  .option('--all', 'Run every suite')
  .option('--build', 'Build tests before running')
  .action(async (str, options) => {
    await run(project, options, str);
  });

program
  .command('init')
  .alias('i')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await init(project);
  });

program
  .command('build')
  .alias('b')
  .description('Trailspile test suites from TypeScript to Javascript')
  .action(async (str, options) => {
    await build(project);
  });

program
  .command('generate')
  .alias('g')
  .argument('<schematic>', 'Thing you want to generate')
  .argument('<name>', 'What you want to call it')
  .action(async (schematic, name, options) =>
    generate(project, schematic, name, options),
  );

program.parse();
