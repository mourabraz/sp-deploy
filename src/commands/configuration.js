import fs from 'fs';
import { join } from 'path';

const requiredKeys = [
  'COMMAND_BUILD',
  'SP_RELATIVE_PATH',
  'SRC_BUILD_REL_FOLDER',
  'DOCUMENT_LIBRARY',
  'DEST_REL_FOLDER',
  'BACKUP_REL_FOLDER',
  'siteUrl',
  'strategy',
  'username',
  'password',
  'fba',
];
const optionaleKeys = ['SP_PROXY_PORT', 'SRC_PROJECT_FOLDER', 'MAXIMUM_BACKUPS'];

let configFile = '';
let config;

export const getConfigPath = () => {
  const path = join(process.cwd(), configFile);

  if (!fs.existsSync(path)) {
    return '';
  }

  return path;
};

export const setConfig = file => {
  configFile = file || join('sp-deploy', 'config.deploy.json');
  const overrideConfigFile = getConfigPath();

  if (!overrideConfigFile) {
    return { error: true, message: 'Config file not found' };
  }

  const configObj = JSON.parse(fs.readFileSync(overrideConfigFile));

  const isValid = Object.entries(configObj).reduce((acc, [k, v]) => {
    if (requiredKeys.includes(k)) {
      // eslint-disable-next-line no-param-reassign
      acc = acc && !!k && !!v;
    } else if (!optionaleKeys.includes(k)) {
      console.log('missing key', k);
      // eslint-disable-next-line no-param-reassign
      acc = false;
    }
    return acc;
  }, true);

  if (!isValid) {
    return {
      error: true,
      message: 'Required "keys" are missing on Config file',
    };
  }

  config = { ...configObj };
  return {
    error: false,
    message: '',
  };
};

export const getConfig = (key = '') => {
  switch (key) {
    case 'SP_PROXY_PORT':
      return config.SP_PROXY_PORT || 8989;
    case 'SRC_PROJECT_FOLDER':
      return config.SRC_PROJECT_FOLDER || process.cwd();
    case 'MAXIMUM_BACKUPS':
      return config.MAXIMUM_BACKUPS || 3;
    case 'SP_RELATIVE_PATH':
      return config.SP_RELATIVE_PATH;
    case 'SRC_BUILD_REL_FOLDER':
      return config.SRC_BUILD_REL_FOLDER;
    case 'DOCUMENT_LIBRARY':
      return config.DOCUMENT_LIBRARY;
    case 'DEST_REL_FOLDER':
      return config.DEST_REL_FOLDER;
    case 'BACKUP_REL_FOLDER':
      return config.BACKUP_REL_FOLDER;
    case 'COMMAND_BUILD':
      return config.COMMAND_BUILD;
    default:
      return config;
  }
};
