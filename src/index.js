// @ts-check

import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import formatOutput from './formatters/index.js';
import buildAST from './ast.js';

const getFileAbsolutePath = (filepath) => path.resolve(process.cwd(), filepath);

const getParsedData = (data, ext) => {
  switch (ext) {
    case '.yml':
      return yaml.load(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw Error(`Unknow file extension: "${ext}"`);
  }
};

export default (filepath1, filepath2, formatName = 'stylish') => {
  const absolutePath1 = getFileAbsolutePath(filepath1);
  const absolutePath2 = getFileAbsolutePath(filepath2);
  const data1 = fs.readFileSync(absolutePath1, 'utf-8');
  const data2 = fs.readFileSync(absolutePath2, 'utf-8');
  const parsedData1 = getParsedData(data1, path.extname(filepath1));
  const parsedData2 = getParsedData(data2, path.extname(filepath2));
  return formatOutput(formatName, buildAST(parsedData1, parsedData2));
};
