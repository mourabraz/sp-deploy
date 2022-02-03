// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';

export const exit = (key = 0, message = '') => {
  switch (key) {
    case 0:
      process.stdout(chalk.green(message || 'Done!'));
      break;
    case 1:
      process.stdout(chalk.red(message || 'Exit with errors!'));
      break;
    default:
      process.stdout(chalk.white(message || 'Exit, unkown!'));
      break;
  }

  process.exit(0);
};
