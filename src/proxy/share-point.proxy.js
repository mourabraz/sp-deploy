import RestProxy from 'sp-rest-proxy';
import { getConfig, getConfigPath } from '../configuration.js';

const settingsBase = {
  configPath: getConfigPath(),
  port: +getConfig('SP_PROXY_PORT'),
  staticRoot: './node_modules/sp-rest-proxy/static',
  logLevel: 0,
};

const restProxyBase = new RestProxy(settingsBase);

export const startProxy = () =>
  new Promise((resolve, reject) => {
    restProxyBase.serve(resolve, reject);
  });
