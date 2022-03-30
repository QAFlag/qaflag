#!/usr/bin/env node

import { list } from './actions/list';
import { Command } from 'commander';

// Get version from package
const pkg = require('../package.json');
const FLAGPOLE_VERSION = pkg.version;

// Initialize CLI
const program = new Command()
  .name('qaflag')
  .description('QA Flag test automation CLI')
  .version(FLAGPOLE_VERSION);

program
  .command('list')
  .description('List available suites')
  .action((str, options) => {
    list();
  });

program.parse();
