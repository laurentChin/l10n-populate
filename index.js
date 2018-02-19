#!/usr/bin/env node

const program = require('commander');

program
  .version('1.0.0', '-v, --version')
  .description('A command line tool to inject translations into static files from json')
  .option('-i, --input [file|directory]', 'The file or directory where the l10n content is stored', './l10n')
  .option('-o, --output [directory]', 'The name of the directory where you want to save the generated file(s)', 'dist')
  .parse(process.argv);
