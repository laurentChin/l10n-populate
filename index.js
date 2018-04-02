#!/usr/bin/env node

const program = require('commander');

const colors = require('colors/safe');

const path = require('path');
const fs = require('fs');

const inputValidator = require('./src/validators/input');
const contentValidator = require('./src/validators/content');

program
  .version('1.0.0', '-v, --version')
  .description('A command line tool to inject translations into static files from json')
  .option('-i, --input [file|directory]', 'The file or directory where the l10n content is stored', 'l10n')
  .option('-o, --output [directory]', 'The name of the directory where you want to save the generated file(s)', 'dist')
  .parse(process.argv);

const absolutePath = path.join(process.env.PWD, program.input);
const invalidInputErrorMessage = colors.red(`The program will now exit because '${program.input}' doesn't seems to be or contains valid file(s)`);

// Check that the input is a valid file (name and extension) or a directory
if (!inputValidator.isValid(absolutePath)) {
  console.log(invalidInputErrorMessage);
  process.exit(1);
}

// If the input is a directory check that it contains valid files
if (fs.statSync(absolutePath).isDirectory()) {
  fs.readdirSync(absolutePath)
    .forEach((file) => {
      const filePath = path.join(absolutePath, file);
      let isValid = inputValidator.isValid(filePath); // validate the filename and extension

      if (isValid && !contentValidator.isValid(fs.readFileSync(filePath))) { // validate the file content
        console.log(invalidInputErrorMessage);
        process.exit(1);
      }
    });
}

// If the input is a file check that it contains a JSON content
if (!fs.statSync(absolutePath).isDirectory() && !contentValidator.isValid(fs.readFileSync(absolutePath))) {
  console.log(invalidInputErrorMessage);
  process.exit(1);
}
