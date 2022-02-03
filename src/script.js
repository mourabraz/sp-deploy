// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';
import emoji from 'node-emoji';
import { options } from './args.js';
import { getConfig } from './configuration.js';
import { startProxy } from './proxy/share-point.proxy.js';
import {
  build,
  saveBackup,
  removeBackups,
  revertToBackup,
  deploy,
  testIfUserCanAuthenticate,
  exit,
} from './commands/index.js';
import { showInBox, showInBoxSuccess, showInBoxError, twirlTimer } from './ui/index.js';

try {
  await startProxy();
  process.stdout.write(
    chalk.green(
      `${emoji.get('heavy_check_mark')}  SharePoint REST Proxy has been started on http://localhost:${getConfig(
        'SP_PROXY_PORT',
      )}\n`,
    ),
  );
  process.stdout.write(chalk.green(`\tRelative Path is: ${getConfig('SP_RELATIVE_PATH')}\n`));
} catch (error) {
  process.stdout.write(chalk.red.bold(`${emoji.get('x')} Error! Could not start proxy server\n`));
}

if (!(await testIfUserCanAuthenticate())) {
  process.stdout.write(chalk.red.bold(`${emoji.get('x')} Error! Could not authenticate sp-proxy\n`));
  exit(1);
}

if (options.revert) {
  process.stdout.write(chalk.yellow('Revert to backup...\n'));
  const stopLoading = twirlTimer();
  const { error, message } = await revertToBackup();
  stopLoading();

  if (error) {
    process.stdout.write(chalk.red('\tError reverting backup\n'));
    showInBoxError(message);
    exit(1);
  } else if (message) {
    process.stdout.write(chalk.green('\tSuccessfully reverted backup\n'));
  } else {
    process.stdout.write(chalk.yellow('\tNothing to revert\n'));
  }

  exit();
}

if (options.build) {
  process.stdout.write(chalk.yellow('Building...\n'));
  const stopLoading = twirlTimer();
  const { error, message } = await build();
  stopLoading();
  if (error) {
    showInBoxError(message);
    exit(1);
  } else {
    showInBox(message);
  }
}

if (options.backup) {
  {
    process.stdout.write(chalk.yellow('Saving a backup...\n'));
    const stopLoading = twirlTimer();
    const { error, message } = await saveBackup();
    stopLoading();
    if (error) {
      process.stdout.write(chalk.red('\tError saving backup\n'));
      showInBoxError(message);
      exit(1);
    } else if (message) {
      process.stdout.write(chalk.green('\tSuccessfully created backup'));
      process.stdout.write(
        chalk.yellow(
          ` total files copied: ${message.filter(i => i.includes('file')).length} | total subfolders: ${
            message.filter(i => i.includes('folder')).length
          }\n`,
        ),
      );
    } else {
      process.stdout.write(chalk.yellow('\tNothing to save as backup\n'));
    }
  }

  {
    process.stdout.write(
      chalk.yellow(`Removing old backups (set to keep the last ${getConfig('MAXIMUM_BACKUPS')})...\n`),
    );
    const stopLoading = twirlTimer();
    const result = await removeBackups();
    stopLoading();
    if (result) {
      process.stdout.write(chalk.green('\tSuccessfully clean backups\n'));
    } else {
      process.stdout.write(chalk.red('\tError removing backups\n'));
    }
  }
} else {
  process.stdout.write(chalk.yellow(`\t${emoji.get('eyes')} Processing without creating a backup\n`));
}

if (options.deploy) {
  process.stdout.write(chalk.yellow('Deploying...\n'));
  const stopLoading = twirlTimer();
  const { success, rejected } = await deploy();
  stopLoading();
  showInBoxSuccess(success);
  showInBoxError(rejected);
}

exit();
