import util from 'util';
import { exec } from 'child_process';
import config from '../../config.js'

const execAsync = util.promisify(exec);

const commandBuild = `yarn --cwd ${config.SRC_PROJECT_FOLDER} ${config.COMMAND_BUILD}`;

export const build = async () => {
  try{
    const { stdout, stderr } = await execAsync(commandBuild);

    if (stderr) {
      throw new Error(typeof stderr === 'string' ? stderr : JSON.stringify(stderr));
    }

    return stdout;
  } catch(error) {
    console.log(`error: ${error.message}`);
    throw new Error('Build fail');
  }
}