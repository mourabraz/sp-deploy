
import chalk from 'chalk';
import emoji from 'node-emoji';

import { options } from './args.js';
import { getConfig } from './commands/configuration.js';
import { startProxy } from './proxy/share-point.proxy.js';
import { build, saveBackup, revertToBackup, deploy, testIfUserCanAuthenticate, exit } from './commands/index.js';
import { showInBox, showInBoxSuccess, showInBoxError, twirlTimer } from './ui/index.js';


try {
  await startProxy();
  process.stdout.write(chalk.green(`${emoji.get('heavy_check_mark')}  SharePoint REST Proxy has been started on http://localhost:${getConfig().SP_PROXY_PORT}\n`));
  process.stdout.write(chalk.green(`\tRelative Path is: ${getConfig().SP_RELATIVE_PATH}\n`));
} catch (error) {
  process.stdout.write(chalk.red.bold(`${emoji.get('x')} Error! Could not start proxy server\n`));
}

if(! await testIfUserCanAuthenticate()) {
  process.stdout.write(chalk.red.bold(`${emoji.get('x')} Error! Could not authenticate sp-proxy\n`));
  exit(1);
}

/* if(options.revert){
  process.stdout.write(chalk.yellow( "Revert to backup...\t"));
  const stopLoading = twirlTimer();
  const result = await revertToBackup();
  stopLoading();
  
  if(typeof result === 'boolean' && result) {
    process.stdout.write(chalk.green('Successfully reverted backup\n'));
  } else if(typeof result === 'boolean') {
    process.stdout.write(chalk.red('Error reverting backup\n'));
  } else {
    process.stdout.write(chalk.yellow('Nothing to revert\n'));
  }

  exit();
} */

if(options.build) {
  process.stdout.write(chalk.yellow('Building...\n'));
  const stopLoading = twirlTimer();
  const result = await build();
  stopLoading();
  showInBox(result);
}

/* if(!options.nobackup) {
  process.stdout.write(chalk.yellow('Saving a backup...\t'));
  
  const stopLoading = twirlTimer();
  const result = await saveBackup();
  stopLoading();

  if(typeof result === 'boolean' && result) {
    process.stdout.write(chalk.green('Successfully created backup\n'));
  } else if(typeof result === 'boolean') {
    process.stdout.write(chalk.red('Error saving backup\n'));
  } else {
    process.stdout.write(chalk.yellow('Nothing to save as backup\n'));
  }
} */

if(options.deploy) {
  process.stdout.write(chalk.yellow('Deploying...\n'));
  const stopLoading = twirlTimer();
  const { success, rejected } = await deploy();
  stopLoading();
  showInBoxSuccess(success);
  showInBoxError(rejected);
}


exit();