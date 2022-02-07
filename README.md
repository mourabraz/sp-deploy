# A helper script to send files to SharePoint

- it uses a proxy to read, create and upload files/folders through SP rest API.

# Install

1. install the package

```
npm install --save-dev mb-sp-deploy
```

or

```
yarn add -D mb-sp-deploy
```

2. create a folder in the root directory called `sp-deploy`
3. add a `config.deploy.json` file

- it is possible to use a different name, but by default, the script looks for `<root>/sp-deploy/config.deploy.json`

- The `config.deploy.json` should have the following values:

  | key                  | value                                         | description                                          |
  | -------------------- | --------------------------------------------- | ---------------------------------------------------- |
  | siteUrl              | SharePoint URL                                | required                                             |
  | strategy             | used in SP proxy                              | required                                             |
  | username             | used in SP proxy                              | required                                             |
  | password             | used in SP proxy                              | required                                             |
  | fba                  | used in SP proxy                              | required                                             |
  | SP_RELATIVE_PATH     |                                               | required                                             |
  | DOCUMENT_LIBRARY     | the name of the Document Library in SP        | required                                             |
  | DEST_REL_FOLDER      | relative path to destination folder           | required                                             |
  | BACKUP_REL_FOLDER    | relative path to backup folder                | required                                             |
  | COMMAND_BUILD        | the npm command to build the application      | required                                             |
  | SRC_BUILD_REL_FOLDER | relative path to the application built folder | required                                             |
  | SRC_PROJECT_FOLDER   | relative path to the aplication root folder   | optional<br>default value: current working directory |
  | MAXIMUM_BACKUPS      | total backups folders to keep                 | optional<br>default value: 3                         |
  | SP_PROXY_PORT        |                                               | optional<br>default value: 8989                      |

```json
{
  "siteUrl": "https://my-sharepoint-url.com",
  "strategy": "OnpremiseFbaCredentials",
  "username": "exxxxx",
  "password": "",
  "fba": true,
  "SP_RELATIVE_PATH": "",
  "DOCUMENT_LIBRARY": "",
  "DEST_REL_FOLDER": "my/webpage",
  "BACKUP_REL_FOLDER": "my/backup",
  "COMMAND_BUILD": "build",
  "SRC_BUILD_REL_FOLDER": "",
  "SRC_PROJECT_FOLDER": "",
  "MAXIMUM_BACKUPS": 3,
  "SP_PROXY_PORT": 8989
}
```
