import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

import getDiff from '../index.js';
import getParsedData from '../src/parsers/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ymlFiles = ['file1.yml', 'file2.yml'];
const jsonFiles = ['file1.json', 'file2.json'];

const getPath = (name) => path.resolve(__dirname, '..', '__fixtures__', name);

describe('parse file', () => {
  test.each(jsonFiles)('parse JSON %s', (fileName) => {
    const data1 = fs.readFileSync(getPath(fileName), 'utf-8');
    const actual1 = getParsedData(getPath(fileName));
    expect(JSON.parse(data1)).toEqual(actual1);
  });

  test.each(ymlFiles)('parse YML %s', (fileName) => {
    const data2 = fs.readFileSync(getPath(fileName), 'utf-8');
    const actual2 = getParsedData(getPath(fileName));
    expect(yaml.safeLoad(data2)).toEqual(actual2);
  });
});

describe('show difference in files', () => {
  const expected = fs.readFileSync(getPath('result.txt'), 'utf-8');

  test('JSON files', () => {
    const actual = getDiff(getPath('file1.json'), getPath('file2.json'));
    expect(actual).toEqual(expected);
  });

  test('YML files', () => {
    const actual = getDiff(getPath('file1.yml'), getPath('file2.yml'));
    expect(expected).toEqual(actual);
  });
});
