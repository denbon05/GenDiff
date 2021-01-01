import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import _ from 'lodash';

const getParsedData = (filepath) => {
	const normPath = _.isEqual(_.first(filepath), '/') ? filepath.slice(1) : filepath;
	const absolutePath = path.resolve(process.cwd(), normPath);
  const data = fs.readFileSync(absolutePath, 'utf-8');
  const fileExt = path.extname(absolutePath);
  switch (fileExt) {
    case '.yml':
      return yaml.safeLoad(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw Error(`Unknow file extension: "${fileExt}"`);
  }
};

export default getParsedData;
