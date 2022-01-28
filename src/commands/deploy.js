import fs from 'fs';
import glob from 'glob';
import { folderExists, createFolder, sendFile, createFolderIfNotExists } from '../api/index.js';

const folder = `${process.env.SRC_PROJECT_FOLDER}/${process.env.SRC_BUILD_REL_FOLDER}`;

const getAllFiles = () => {
  return new Promise((resolve, reject)=> {
    glob(
      `${folder}/**/*`,
      { nosort: true, nodir: true },
      (error, files) => {
        if (error) {
          console.log('Error', error);
          reject(error);
        } else {
          const temp = files
            .map(i => i.replace(`${folder}/`, '').split('/'))
            .map(i => {
              if (i.length === 1) return i;
              return [
                i.slice(0, i.length - 1).join('/'),
                i[i.length - 1],
              ];
            });

          resolve(temp);
        }
      },
    );
  })
}

const createFoldersByPath = async (path) => {
  const folders = path.split('/');
  let parentFolder = '';
  const promises = [];

  folders.forEach(folder => {
    promises.push(createFolderIfNotExists(`${process.env.DEST_REL_FOLDER}/${parentFolder}${folder}`));
    parentFolder = `${parentFolder}${folder}/`;
  });

  await Promise.allSettled(promises);
}

const createFoldersByArray = async (folders) => {
  const promises = folders.map(createFoldersByPath);
  await Promise.allSettled(promises);
}

const sendFileToFolder = async (
  folderSrc,
  folderDest,
  [folder, fileName],
) => {
  if (!fileName) {
    const result = await sendFile(
      fs.readFileSync(`${folderSrc}/${folder}`),
      folder,
      folderDest,
    );

    return result?.ServerRelativeUrl;
  }

  const result = await sendFile(
        fs.readFileSync(`${folderSrc}/${folder}/${fileName}`),
        fileName,
        `${folderDest}/${folder}`,
      );

  return result?.ServerRelativeUrl;
};

export const deploy = async () => {
  const checkSrcFolder = fs.existsSync(`${process.env.SRC_PROJECT_FOLDER}/${process.env.SRC_BUILD_REL_FOLDER}`);
  
  if(!checkSrcFolder) {
    throw new Error('Build folder not found') 
  }

  const destFolderExists = await folderExists(process.env.DEST_REL_FOLDER);
  if(!destFolderExists) {
    await createFolder(process.env.DEST_REL_FOLDER);
  }

  const listOfFiles = await getAllFiles();
  const listOfFolders = Array.from(new Set([...listOfFiles.filter(i => i.length > 1).map(i => i[0])]));
  await createFoldersByArray(listOfFolders);

  const promises = listOfFiles.map(i => sendFileToFolder(folder, process.env.DEST_REL_FOLDER, i))
  const results = await Promise.allSettled(promises);
  const success = results.filter(result => result.status === 'fulfilled').map(i => i.value);
  const rejected = results.filter(result => result.status === 'rejected').map(result => result.reason.response.data.error.message.value);

  return [...success, ...rejected];
}