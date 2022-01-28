import dotenv from 'dotenv';
import RestProxy from 'sp-rest-proxy';

dotenv.config();

const settingsBase = {
  configPath: './src/config/sp-proxy.config.json',
  port: +process.env.SP_PROXY_PORT,
  staticRoot: './node_modules/sp-rest-proxy/static',
  logLevel: 0,
};

const restProxyBase = new RestProxy(settingsBase);

export const startProxy = () => {
  return new Promise((resolve, reject) => {
    restProxyBase.serve(resolve, reject);
  })
};