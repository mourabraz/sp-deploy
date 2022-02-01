import boxen from 'boxen';
import chalk from 'chalk';
import emoji from 'node-emoji';

// https://stackoverflow.com/questions/34848505/how-to-make-a-loading-animation-in-console-application-written-in-javascript-or
const P = ["\\", "|", "/", "-"];
export const twirlTimer = () => {
  let x = 0;
  const intervalId = setInterval(function() {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);

  return () => {
    process.stdout.write("\r");
    clearInterval(intervalId);
  };
};

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'white',
 };
export const showInBox = (message) => {
  console.log(boxen(message, boxenOptions));
}
const boxenOptionsSuccess = {
  ...boxenOptions,
  title: 'Success'
 };
export const showInBoxSuccess = (message) => {
  if(typeof message === 'string') {
    console.log(boxen(chalk.green(message), boxenOptionsSuccess));
  } else if(Array.isArray(message)) {
    console.log(boxen(chalk.green(message.join('\n')), boxenOptionsSuccess));
  } else  {
    console.log(boxen(chalk.green('Success'), boxenOptionsSuccess));
  }
}
const boxenOptionsError = {
  ...boxenOptions,
  title: 'Error'
 };
export const showInBoxError = (message) => {
  if(typeof message === 'string') {
    console.log(boxen(chalk.red(message), boxenOptionsError));
  } else if(Array.isArray(message)) {
    console.log(boxen(chalk.red(message.map(i => `${emoji.get('x')} ${i}`).join('\n')), boxenOptionsError));
  } else  {
    console.log(boxen(chalk.red('Error'), boxenOptionsError));
  }
}