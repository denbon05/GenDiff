import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

import getDiff from '../index.js';
import getParsedData from '../src/parsers/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);console.log('dirname->>>', __dirname)

const ymlFiles = ['flat1.yml', 'flat2.yml'];
const jsonFiles = ['file1.json', 'file2.json'];

const getPath = (name) => path.resolve(__dirname, '__fixtures__', name);

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
  test('JSON files', () => {
    const expected = fs.readFileSync(getPath('result.txt'), 'utf-8');
    const actual = getDiff(getPath('file1.json'), getPath('file2.json'));
    expect(actual).toEqual(expected);
  });

  test('YML files', () => {
    const expected = fs.readFileSync(getPath('result2.txt'), 'utf-8');
    const actual = getDiff(getPath('flat1.yml'), getPath('flat2.yml'));
    expect(expected).toEqual(actual);
	});
	
	test('JSON nested files', () => {
		const expected = fs.readFileSync(getPath('result3.txt'), 'utf-8');
		const actual = getDiff(getPath('nested1.json'), getPath('nested2.json'));
		expect(expected).toEqual(actual);
	});
});
