import { getConfig } from './configuration.js';
import { getFolders, renameFolder, removeFolder } from '../api/index.js';

export const revertToBackup = async () => {
  const parentFolder = getConfig().DEST_REL_FOLDER.split('/').slice(0, -1).join('/');
  const folders = (await getFolders(parentFolder)).map(i => i.Name);
  const backupFolders = folders.filter(i => i.includes('-backup')).sort();
  const lastBackup = backupFolders.shift();

  if(!lastBackup) {
    return null;
  }

  await removeFolder(getConfig().DEST_REL_FOLDER);

  const result = await renameFolder(`${parentFolder}/${lastBackup}`, getConfig().DEST_REL_FOLDER);

  return result;
}