import { Command } from 'commander';
// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';

const program = new Command();
program
  .option('-c, --config [type]', 'set config file')
  .option('-r, --revert', 'set previous backup as destination folder')
  .option('-s, --backup', 'do a backup')
  .option('-b, --build', 'run the build command')
  .option('-d, --deploy', 'deploy to sharepoint');

export const options = program.parse(process.argv).opts();

export const exit = (key = 0, message = '') => {
  switch (key) {
    case 0:
      process.stdout.write(chalk.green(message || 'Done!'));
      break;
    case 1:
      process.stdout.write(chalk.red(message || 'Exit with errors!'));
      break;
    default:
      process.stdout.write(chalk.white(message || 'Exit, unkown!'));
      break;
  }

  process.exit(0);
};
