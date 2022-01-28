import { renameFolder } from "../api/index.js"

export const saveBackup = async () => {
  let backupFolder = process.env.BACKUP_REL_FOLDER.split('/');
  backupFolder[backupFolder.length-1] = new Date().getTime() + '-' + backupFolder[backupFolder.length-1];
  backupFolder = backupFolder.join('/');

  const result = await renameFolder(process.env.DEST_REL_FOLDER, backupFolder);

  return result;
}