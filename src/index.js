import _ from 'lodash';

import getParsedData from './parsers/parser.js';

export default (filepath1, filepath2) => {
  const obj1 = getParsedData(filepath1);
  const obj2 = getParsedData(filepath2);
  const ownKeysObj2 = Object.keys(obj2).filter((key) => !_.has(obj1, key));
  const diffCol = Object.entries(obj1)
    .concat(ownKeysObj2)
    .sort((a, b) => {
      const aKey = _.first(a);
      const bKey = _.first(b);
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    })
    .reduce((acc, line) => {
      if (_.isString(line)) {
        acc.push(`  + ${line}: ${obj2[line]}`);
        return acc;
      }
      const [key, value] = line;
      if (_.has(obj2, key) && obj2[key] === value) acc.push(`    ${key}: ${value}`);
      if (_.has(obj2, key) && obj2[key] !== value) {
        acc.push(`  - ${key}: ${value}`);
        acc.push(`  + ${key}: ${obj2[key]}`);
      }
      if (!_.has(obj2, key)) acc.push(`  - ${key}: ${value}`);
      return acc;
    }, []);
  return `{\n${diffCol.join('\n')}\n}`;
};
