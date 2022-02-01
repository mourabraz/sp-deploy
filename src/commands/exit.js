import chalk from 'chalk';

export const exit = (key = 0, message = '') => {
  switch (key) {
    case 0:
      console.log(chalk.green(message || 'Done!'));
      break;
    case 1:
      console.log(chalk.red(message || 'Exit with errors!'));
      break; 
    default:
      console.log(chalk.white(message || 'Exit, unkown!'));
      break;
  }

  process.exit(0);
}