#!/usr/bin/env node

import { list } from './actions/list';
import { Command } from 'commander';
import { plan } from './actions/plan';
import cli from './cli';
import Project from './models/project';
import { init } from './actions/init';
import { run } from './actions/run';

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
  .command('list')
  .description('List available suites')
  .action((str, options) => {
    list();
  });

program
  .command('plan')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await plan();
  });

program
  .command('run')
  .description('Run a test suite')
  .action(async (str, options) => {
    await run();
  });

program
  .command('init')
  .description('Get test plan for a suite')
  .action(async (str, options) => {
    await init(project);
  });

program.parse();