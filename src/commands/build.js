import util from 'util';
import { exec } from 'child_process';
import { getConfig } from '../configuration.js';

const execAsync = util.promisify(exec);

const commandBuild = `yarn --cwd ${getConfig('SRC_PROJECT_FOLDER')} ${getConfig('COMMAND_BUILD')}`;

export const build = async () => {
  try {
    const { stdout, stderr } = await execAsync(commandBuild);

    if (stderr) {
      throw new Error(typeof stderr === 'string' ? stderr : JSON.stringify(stderr));
    }

    return { error: false, message: stdout };
  } catch (error) {
    return { error: true, message: error.message };
  }
};
