#!/usr/bin/env node
"use strict"

import { Command } from 'commander';
import chalk from "chalk";
import { startProxy } from "../src/proxy/share-point.proxy.js";
import { build, saveBackup, revertToBackup, deploy } from '../src/commands/index.js';
import { showInBox, twirlTimer } from '../src/ui/index.js';

const program = new Command();
program
  .option('-r, --revert', 'set previous backup as destination folder')
  .option('-b, --build', 'run the build command')
  .option('-B, --nobackup', 'do not create backup')
  .option('-d, --deploy', 'deploy to sharepoint');
program.parse(process.argv);
const options = program.opts();

console.log(chalk.green("Start!\n"));

try {
  await startProxy();
  console.log(chalk.green(`SharePoint REST Proxy has been started on http://localhost:${process.env.SP_PROXY_PORT}`));
  console.log(chalk.green(`Relative Path is: ${process.env.SP_RELATIVE_PATH}\n`));
} catch (error) {
  console.log(chalk.red.bold("Error! Could not start proxy server"));
}

if(options.revert){
  console.log(chalk.yellow( "Revert to backup..."));
  const stopLoading = twirlTimer();
  const result = await revertToBackup();
  stopLoading();
  
  if(typeof result === 'boolean' && result) {
    console.log(chalk.green("Successfully reverted backup"));
  } else if(typeof result === 'boolean') {
    console.log(chalk.red("Error reverting backup"));
  } else {
    console.log(chalk.yellow("Nothing to revert"));
  }

  console.log(chalk.green( "Finish!"));
  process.exit();
}

if(options.build) {
  console.log(chalk.yellow( "Building..."));
  const stopLoading = twirlTimer();
  const result = await build();
  stopLoading();
  showInBox(result);
}

if(!options.nobackup) {
  console.log(chalk.yellow( "Saving a backup..."));
  const stopLoading = twirlTimer();
  const result = await saveBackup();
  stopLoading();

  if(typeof result === 'boolean' && result) {
    console.log(chalk.green("Successfully created backup"));
  } else if(typeof result === 'boolean') {
    console.log(chalk.red("Error saving backup"));
  } else {
    console.log(chalk.yellow("Nothing to save as backup"));
  }
}

if(options.deploy) {
  console.log(chalk.yellow( "Deploying..."));
  const stopLoading = twirlTimer();
  const result = await deploy();
  stopLoading();
  showInBox(result.join('\n'));
}


console.log(chalk.green( "Finish!"));
process.exit();