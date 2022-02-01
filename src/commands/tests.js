import { getConfig } from './configuration.js';
import { folderExists } from '../api/index.js';

export const testIfUserCanAuthenticate = async () => {
  try {
    await folderExists(getConfig().DOCUMENT_LIBRARY);
    return true;
  } catch (error) {
    console.log(error.response.status, error.response.data);
    return false;
  }
}