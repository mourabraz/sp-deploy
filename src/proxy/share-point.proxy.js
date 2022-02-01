import RestProxy from 'sp-rest-proxy';
import config from '../../config.js'
import { getConfigPath } from '../commands/configuration.js';

const settingsBase = {
  configPath: getConfigPath(),
  port: +config.SP_PROXY_PORT,
  staticRoot: './node_modules/sp-rest-proxy/static',
  logLevel: 0,
};

const restProxyBase = new RestProxy(settingsBase);

export const startProxy = () => {
  return new Promise((resolve, reject) => {
    restProxyBase.serve(resolve, reject);
  })
};