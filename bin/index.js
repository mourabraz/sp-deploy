#!/usr/bin/env node

// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';
import emoji from 'node-emoji';
import { options, exit } from '../src/args.js';
import { setConfig } from '../src/config/index.js';

process.stdout.write(chalk.green(`${emoji.get('rocket')} Start!\n`));

const { error, message } = setConfig(options.config);

if (error) {
  exit(1, chalk.red.bold(`${emoji.get('x')} Error! Could not set necessary configuration\n\t"${message}"\n`));
} else {
  import('../src/script.js');
}
