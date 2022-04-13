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

// Initialize Project
const project = new Project({
  configFile: process.env.QAFLAG_CONFIG_FILE,
});

// Initialize CLI
const program = new Command()
  .name('qaflag')
  .description('QA Flag test automation CLI')
  .version(cli.version);

program
  .command('server')
  .description('Run the QA Flag web interface.')
  .action(async (str, options) => {
    const server = await startServer();
    open(`http://localhost:${server.port}`);
  });

program
  .command('list')
  .description('List available suites')
  .action((str, options) => {
    list(project);
  });

program
  .command('plan')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await plan(project);
  });

program
  .command('run')
  .description('Run a test suite')
  .option('--all', 'Run every suite')
  .action(async (str, options) => {
    await run(project, options, str);
  });

program
  .command('init')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await init(project);
  });

program.parse();
