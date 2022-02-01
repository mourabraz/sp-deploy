import { Command } from 'commander';

const program = new Command();
program
.option('-c, --config [type]', 'set config file')
.option('-r, --revert', 'set previous backup as destination folder')
.option('-b, --build', 'run the build command')
.option('-N, --nobackup', 'do not create backup')
.option('-d, --deploy', 'deploy to sharepoint');

export const options = program.parse(process.argv).opts();