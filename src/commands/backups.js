import { getConfig } from './configuration.js';
import { getFolders, removeFolder, createFolder, getFoldersAndFiles, cloneFileToFolder, removeFolderByRelativeURL } from '../api/index.js';

const copyFilesRecursively = async (originFolder, destFolder) => {
  try {
    const results = [];
    const { files, folders } = await getFoldersAndFiles(originFolder);

    for (let i = 0; i < files.length; i++) {
      const r = await cloneFileToFolder(files[i], originFolder, destFolder);
      results.push(`copy file "${destFolder}/${files[i].Name}": ${r ? 'OK' : 'FAIL'}`);
    }

    for(let i = 0; i < folders.length; i++) {
      const r = await createFolder(`${destFolder}/${folders[i].Name}`);
      results.push(`create folder "${destFolder}/${folders[i].Name}": ${r ? 'OK' : 'FAIL'}`);

      const resultsSub = await copyFilesRecursively(`${originFolder}/${folders[i].Name}`, `${destFolder}/${folders[i].Name}`);
      results.push(...resultsSub);
    }

    return results;
  } catch (error) {
    console.log(error.response)
    throw error;
  }
}

export const saveBackup = async () => {
  let backupFolder = getConfig().BACKUP_REL_FOLDER.split('/');
  backupFolder[backupFolder.length-1] = new Date().getTime() + '-' + backupFolder[backupFolder.length-1];
  backupFolder = backupFolder.join('/');

  const resultCreateFolder = await createFolder(backupFolder);
  if(!resultCreateFolder){
    return null;
  }

  const results = await copyFilesRecursively(getConfig().DEST_REL_FOLDER, backupFolder);

  return results;
}

export const revertToBackup = async () => {
  try {
    const backupFolders = getConfig().BACKUP_REL_FOLDER.split('/');
    const parentFolder = backupFolders.splice(0, backupFolders.length-1);
    const backupFolder = backupFolders[0];

    const allFolders = (await getFolders(parentFolder))
      .filter(i => i.Name.includes(backupFolder))
      .map(i => i.ServerRelativeUrl)
      .sort();

    const lastBackup = allFolders[allFolders.length-1].split('/').splice(-1);
    if(!lastBackup) {
      return null;
    }

    const lastBackupFolder = `${parentFolder}/${lastBackup}`;

    await removeFolder(getConfig().DEST_REL_FOLDER);
    await createFolder(getConfig().DEST_REL_FOLDER);

    const results = await copyFilesRecursively(lastBackupFolder, getConfig().DEST_REL_FOLDER);

    return results.every(i => i.includes('OK'));
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const removeBackups = async () => {
  try {
    const backupFolders = getConfig().BACKUP_REL_FOLDER.split('/');
    const parentFolder = backupFolders.splice(0, backupFolders.length-1);
    const backupFolder = backupFolders[0];

    const allFolders = (await getFolders(parentFolder))
      .filter(i => i.Name.includes(backupFolder))
      .map(i => i.ServerRelativeUrl)
      .sort();

    const foldersToRemove = allFolders.slice(0, (allFolders.length - getConfig().MAXIMUM_BACKUPS));
    await Promise.all(foldersToRemove.map(i => removeFolderByRelativeURL(i)))

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}