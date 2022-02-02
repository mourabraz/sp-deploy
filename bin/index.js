#!/usr/bin/env node
"use strict"

import chalk from 'chalk';
import emoji from 'node-emoji';
import { options } from '../src/args.js';
import { setConfig } from '../src/commands/configuration.js';
import { exit } from '../src/commands/exit.js';

process.stdout.write(chalk.green(`${emoji.get('rocket')} Start!\n`));

const {error, message} = setConfig(options.config);

if(error) {
  exit(1, chalk.red.bold(`${emoji.get('x')} Error! Could not set necessary configuration\n\t"${message}"\n`));
} else {
  import('../src/script.js');
}