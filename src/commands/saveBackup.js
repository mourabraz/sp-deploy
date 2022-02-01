import { getConfig } from './configuration.js';
import { renameFolder } from '../api/index.js';

export const saveBackup = async () => {
  let backupFolder = getConfig().BACKUP_REL_FOLDER.split('/');
  backupFolder[backupFolder.length-1] = new Date().getTime() + '-' + backupFolder[backupFolder.length-1];
  backupFolder = backupFolder.join('/');

  const result = await renameFolder(getConfig().DEST_REL_FOLDER, backupFolder);

  return result;
}