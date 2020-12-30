import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import getDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPath = (name) => path.resolve(__dirname, '..', '__fixtures__', name);

describe('show difference in files', () => {
  const expected = fs.readFileSync(getPath('result.txt'), 'utf-8');
  const expected2 = fs.readFileSync(getPath('plain.txt'), 'utf-8');

  test('JSON stylish format as default', () => {
    const actual = getDiff(getPath('file1.json'), getPath('file2.json'));
    expect(actual).toEqual(expected);
  });

  test('YAML stylish format as default', () => {
    const actual = getDiff(getPath('file1.yml'), getPath('file2.yml'));
    expect(expected).toEqual(actual);
  });

  test('different extension with stylish format', () => {
    const actual3 = getDiff(getPath('file1.json'), getPath('file2.yml'));
    expect(expected).toEqual(actual3);
  });

  test('plain format', () => {
    const actual4 = genDiff(getPath('file1.yml'), getPath('file2.yml'), 'plain');
    expect(actual4).toEqual(expected2);
  });
});
