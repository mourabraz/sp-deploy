import fs from 'fs';
import glob from 'glob';
import { getConfig } from '../config/index.js';
import { folderExists, createFolder, sendFile, createFolderIfNotExists } from '../api/index.js';

const FOLDER = `${getConfig('SRC_PROJECT_FOLDER')}/${getConfig('SRC_BUILD_REL_FOLDER')}`;

const changeAllHtmlExtensionsToTxt = files => {
  const [otherFiles, htmlFiles] = files.reduce(
    (acc, item) => {
      if (!item.endsWith('.html')) acc[0].push(item);
      else acc[1].push(item);
      return acc;
    },
    [[], []],
  );

  let newName;
  for (let i = 0; i < htmlFiles.length; i++) {
    newName = htmlFiles[i].replace('.html', '.txt');
    fs.renameSync(htmlFiles[i], newName);
    htmlFiles[i] = newName;
  }

  return otherFiles.concat(htmlFiles);
};

const getAllFiles = () =>
  new Promise((resolve, reject) =>
    // eslint-disable-next-line no-promise-executor-return
    glob(`${FOLDER}/**/*`, { nosort: true, nodir: true }, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const temp = changeAllHtmlExtensionsToTxt(files)
          .map(i => i.replace(`${FOLDER}/`, '').split('/'))
          .map(i => {
            if (i.length === 1) return i;
            return [i.slice(0, i.length - 1).join('/'), i[i.length - 1]];
          });

        resolve(temp);
      }
    }),
  );

const createFoldersByPath = async path => {
  const folders = path.split('/');
  let parentFolder = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const folder of folders) {
    await createFolderIfNotExists(`${getConfig('DEST_REL_FOLDER')}/${parentFolder}${folder}`);
    parentFolder = `${parentFolder}${folder}/`;
  }
};

const createFoldersByArray = async folders => {
  const promises = folders.map(createFoldersByPath);
  await Promise.allSettled(promises);
};

const sendFileToFolder = async (folderSrc, folderDest, [folder, fileName]) => {
  if (!fileName) {
    const result = await sendFile(fs.readFileSync(`${folderSrc}/${folder}`), folder, folderDest);

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
  const checkSrcFolder = fs.existsSync(`${getConfig('SRC_PROJECT_FOLDER')}/${getConfig('SRC_BUILD_REL_FOLDER')}`);

  if (!checkSrcFolder) {
    throw new Error('Build folder not found');
  }

  const destFolderExists = await folderExists(getConfig('DEST_REL_FOLDER'));
  if (!destFolderExists) {
    await createFolder(getConfig('DEST_REL_FOLDER'));
  }

  const listOfFiles = await getAllFiles();
  const listOfFolders = Array.from(new Set([...listOfFiles.filter(i => i.length > 1).map(i => i[0])]));
  await createFoldersByArray(listOfFolders);

  const promises = listOfFiles.map(i => sendFileToFolder(FOLDER, getConfig('DEST_REL_FOLDER'), i));
  const results = await Promise.allSettled(promises);
  const success = results.filter(result => result.status === 'fulfilled').map(i => i.value);
  const rejected = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason.response?.data?.error?.message?.value);

  return { success, rejected };
};
