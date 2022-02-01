import config from '../../config.js'
import { folderExists } from '../api/index.js';

export const testIfUserCanAuthenticate = async () => {
  try {
    await folderExists(config.DOCUMENT_LIBRARY);
    return true;
  } catch (error) {
    console.log(error.response.status, error.response.data);
    return false;
  }
}