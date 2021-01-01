#!/usr/bin/env node
import fs from 'fs';
import { program } from 'commander';
import genDiff from '../index.js';

const pkgVersion = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  .version;

program
  .version(pkgVersion)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const dff = genDiff(filepath1, filepath2, program.format);
    console.log(dff);
  })
  .parse(process.argv);
