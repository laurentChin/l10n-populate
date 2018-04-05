#!/usr/bin/env node

const program = require('commander');

const colors = require('colors/safe');

const path = require('path');
const fs = require('fs');

const inputValidator = require('./src/validators/input');
const contentValidator = require('./src/validators/content');
const templateValidator = require('./src/validators/template');

const l10n = require('./src/l10n');

const invalidPathErrorMessage = require('./src/errors/invalidPathErrorMessage');

program
  .version('1.0.0', '-v, --version')
  .description('A command line tool to inject translations into static files from json')
  .option('-i, --input [file|directory]', 'The file or directory where the l10n content is stored', 'l10n')
  .option('-t, --template [file|directory]', 'The file or directory where the l10n content will be injected', '.')
  .option('-o, --output [directory]', 'The name of the directory where you want to save the generated file(s)', 'dist')
  .parse(process.argv);

const inputAbsolutePath = path.join(process.env.PWD, program.input);
const templateAbsolutePath = path.join(process.env.PWD, program.template);
const targetAbsolutePath = path.join(process.env.PWD, program.output);

const invalidInputErrorMessage = colors.red(invalidPathErrorMessage.generate(program.input));
const invalidTemplateErrorMessage = colors.red(invalidPathErrorMessage.generate(program.template));

// Check that the input is a valid file (name and extension) or a directory
if (!inputValidator.isValid(inputAbsolutePath)) {
  console.log(invalidInputErrorMessage);
  process.exit(1);
}

// If the input is a directory check that it contains valid files
if (fs.statSync(inputAbsolutePath).isDirectory()) {
  fs.readdirSync(inputAbsolutePath)
    .forEach((file) => {
      const filePath = path.join(inputAbsolutePath, file);
      let isValid = inputValidator.isValid(filePath); // validate the filename and extension

      if (isValid && !contentValidator.isValid(fs.readFileSync(filePath))) { // validate the file content
        console.log(invalidInputErrorMessage);
        process.exit(1);
      }
    });
}

// If the input is a file check that it contains a JSON content
if (!fs.statSync(inputAbsolutePath).isDirectory() && !contentValidator.isValid(fs.readFileSync(inputAbsolutePath))) {
  console.log(invalidInputErrorMessage);
  process.exit(1);
}

// Check that the template option is an .html file or a directory containing html file(s)
if (!templateValidator.isValid(templateAbsolutePath)) {
  console.log(invalidTemplateErrorMessage);
  process.exit(1);
}

l10n
  .process(inputAbsolutePath, templateAbsolutePath, targetAbsolutePath)
  .then((numberOfFileCreated) => {
    console.log(colors.green(`${numberOfFileCreated} files have been created`));
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
