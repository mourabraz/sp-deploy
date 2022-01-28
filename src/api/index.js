import axios from 'axios';

const baseURL = `http://localhost:${process.env.SP_PROXY_PORT}/${process.env.SP_RELATIVE_PATH}/_api/web`;

export const createFolderIfNotExists = async (folderName) => {
  const getEndpoint = `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')`;
  const postEndpoint = `${baseURL}/folders/add('SiteAssets/${folderName}')`;

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

export const createFolder = async (folderName) => {
  const endpoint = 
    `${baseURL}/folders/add('SiteAssets/${folderName}')`;

    const response = await axios.post(endpoint, null, {
      headers: {
        accept: 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': '',
      },
    });

    return response?.status === 200;
};

export const folderExists = async (folderName) => {
  const endpoint = 
    `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')`;

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

export const getFolders = async (folderName) => {
  const endpoint = 
    `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')?$expand=Folders`;

    const response = await axios.get(endpoint, {
      headers: {
        accept: 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': '',
      },
    });

    return response.data?.d?.Folders?.results || [];
};

export const renameFolder = async (folderName, newName) => {
  const endpoint = 
    `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')/ListItemAllFields`;

  const response = await axios.get(endpoint, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });
  const type = response.data.d.__metadata?.type

  if(!type) {
    return null;
  }

  const responsePost = await axios.post(
    endpoint,
    {
      __metadata: {
        type: response.data.d.__metadata.type,
      },
      Title: newName,
      FileLeafRef: newName,
    },
    {
      headers: {
        accept: 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': '',
        'X-HTTP-Method': 'MERGE',
        'If-Match': '*',
      },
    },
  );

  return responsePost?.status === 204;
};

export const removeFolder = async (folderName) => {
  const endpoint = `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')`;

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

export const sendFile = async (
  file,
  fileName,
  folderName,
) => {
  const endpoint = 
    `${baseURL}/getfolderbyserverrelativeurl('SiteAssets/${folderName}')/Files/Add(url='${fileName}', overwrite=true)`;

  const response = await axios.post(endpoint, file, {
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': '',
    },
  });

  return response.data.d;
};
