import fs from 'fs';
import { join } from 'path';

const requiredKeys = ['SP_PROXY_PORT', 'COMMAND_BUILD', 'MAXIMUM_BACKUPS', 'SP_RELATIVE_PATH', 'SRC_PROJECT_FOLDER', 'SRC_BUILD_REL_FOLDER', 'DOCUMENT_LIBRARY', 'DEST_REL_FOLDER', 'BACKUP_REL_FOLDER', 'siteUrl', 'strategy', 'username', 'password', 'fba'];
const optionaleKeys = [];

let configFile = '';
let config;

export const getConfigPath = () => {
  const path = join(process.cwd(), configFile); // join(process.cwd(), '..', configFile)
  
  if(!fs.existsSync(path)) {
    return '';
  }
  
  return path;
}

export const setConfig = (file = 'sp-deploy/config.deploy.json') => {
  configFile = file;
  const overrideConfigFile = getConfigPath();
  
  console.log(overrideConfigFile)
  
  if(!overrideConfigFile) {
    return { error: true, message: 'Config file not found' };
  }
  
  const configObj = JSON.parse(fs.readFileSync(overrideConfigFile));
  
  const isValid = Object.entries(configObj).reduce((acc, [k,v]) => {
    if(requiredKeys.includes(k)) {
      acc = acc && !!k && !!v;
    } else if(!optionaleKeys.includes(k)) {
      console.log('missing key', k)
      acc = false;
    }
    return acc;
  }, true);
  
  if(!isValid) {
    return { error: true, message: 'Required "keys" are missing on Config file' };
  }
  
/*   const data = JSON.stringify(configObj, null, 2);
  fs.writeFileSync('config.js', `export default ${data}`); */

  config = {...configObj};
  return {
    error: false,
    message: '',
  }
}

export const getConfig = () =>  {
  return config;
}