import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPath = (name) => path.resolve(__dirname, '..', '__fixtures__', name);

describe('show difference in files', () => {
  const expected = fs.readFileSync(getPath('result.txt'), 'utf-8');
  const expected2 = fs.readFileSync(getPath('plain.txt'), 'utf-8');
  const expected3 = fs.readFileSync(getPath('result.json'), 'utf-8');

  test('JSON extension with stylish format as default', () => {
    const actual = genDiff(getPath('file1.json'), getPath('file2.json'));
    expect(actual).toEqual(expected);
  });

  test('YAML extension with stylish format as default', () => {
    const actual2 = genDiff(getPath('file1.yml'), getPath('file2.yml'));
    expect(actual2).toEqual(expected);
  });

  test('different extension with stylish format', () => {
    const actual3 = genDiff(getPath('file1.json'), getPath('file2.yml'));
    expect(actual3).toEqual(expected);
  });

  test('plain format', () => {
    const actual4 = genDiff(getPath('file1.yml'), getPath('file2.yml'), 'plain');
    expect(actual4).toEqual(expected2);
  });

  test('json format', () => {
    const actual5 = genDiff(getPath('file1.yml'), getPath('file2.yml'), 'json');
    expect(actual5).toEqual(expected3);
  });
});
