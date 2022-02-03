import axios from 'axios';
import { getConfig } from '../commands/configuration.js';

const baseURL = `http://localhost:${getConfig('SP_PROXY_PORT')}/${getConfig('SP_RELATIVE_PATH')}/_api/web`;

export const createFolderIfNotExists = async folderName => {
  const getEndpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig('DOCUMENT_LIBRARY')}/${folderName}')`;
  const postEndpoint = `${baseURL}/folders/add('${getConfig('DOCUMENT_LIBRARY')}/${folderName}')`;

  // eslint-disable-next-line consistent-return
  return axios.get(getEndpoint).catch(error => {
    if (error.response.status === 404) {
      return axios.post(postEndpoint, null, {
        headers: {
          accept: 'application/json; odata=verbose',
          'content-type': 'application/json; odata=verbose',
          'X-RequestDigest': '',
        },
      });
    }
  });
};

export const createFolder = async folderName => {
  const endpoint = `${baseURL}/folders/add('${getConfig('DOCUMENT_LIBRARY')}/${folderName}')`;

  const response = await axios.post(endpoint, null, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return response?.status === 200;
};

export const folderExists = async folderName => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig('DOCUMENT_LIBRARY')}/${folderName}')`;

  try {
    await axios.get(endpoint, {
      headers: {
        accept: 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': '',
      },
    });

    return true;
  } catch (error) {
    if (error.response.status === 404) {
      return false;
    }

    throw error;
  }
};

export const getFolders = async folderName => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig(
    'DOCUMENT_LIBRARY',
  )}/${folderName}')?$expand=Folders`;

  const response = await axios.get(endpoint, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return response.data?.d?.Folders?.results || [];
};

export const getFoldersAndFiles = async folderName => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig(
    'DOCUMENT_LIBRARY',
  )}/${folderName}')?$expand=Folders,Files`;

  const response = await axios.get(endpoint, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return {
    folders: response.data?.d?.Folders?.results || [],
    files: response.data?.d?.Files?.results || [],
  };
};

export const removeFolder = async folderName => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig('DOCUMENT_LIBRARY')}/${folderName}')`;

  const response = await axios.post(endpoint, null, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
      'If-Match': '*',
      'X-HTTP-Method': 'DELETE',
    },
  });

  return response.status === 200;
};

export const removeFolderByRelativeURL = async relativeUrl => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${relativeUrl}')`;

  const response = await axios.post(endpoint, null, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
      'If-Match': '*',
      'X-HTTP-Method': 'DELETE',
    },
  });

  return response.status === 200;
};

export const sendFile = async (file, fileName, folderName) => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('${getConfig(
    'DOCUMENT_LIBRARY',
  )}/${folderName}')/Files/Add(url='${fileName}', overwrite=true)`;

  const response = await axios.post(endpoint, file, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return response.data.d;
};

export const cloneFileToFolder = async (file, folderOrinin, folderDest) => {
  const from = file.ServerRelativeUrl;
  const to = file.ServerRelativeUrl.replace(folderOrinin, folderDest);
  const endpoint = `${baseURL}/getfilebyserverrelativeurl(@r)/copyto(strnewurl=@n)?@r='${from}'&@n='${to}'`;

  const response = await axios.post(endpoint, null, {
    binaryStringResponseBody: true,
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return response?.status === 200;
};
