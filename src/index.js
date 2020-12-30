import _ from 'lodash';

import getParsedData from './parsers/parser.js';

export default (o1, o2) => {
  const spacesCount = 2;

  const makeDeepNode = (node, spaceCount) => {
    const keys = Object.keys(node);
    return keys.reduce((acc, key) => {
      const value = node[key];
      if (_.isPlainObject(value)) {
        acc[`${' '.repeat(spaceCount)}${key}`] = makeDeepNode(value, spaceCount);
      } else acc[`${' '.repeat(spaceCount)}${key}`] = value;
      return acc;
    }, {});
  };

  const genDeepDiff = (obj1, obj2, spaceCount = spacesCount) => {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    const uniqObj2Keys = obj2Keys.filter((k) => !_.has(obj1, k));
    return obj1Keys
      .concat(uniqObj2Keys)
      .sort()
      .reduce((acc, key) => {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
          acc[`${' '.repeat(spaceCount)}${key}`] = genDeepDiff(value1, value2, spaceCount);
          return acc;
        }
        if (_.isPlainObject(value1) || _.isPlainObject(value2)) {
          if (_.isPlainObject(value1) && _.isUndefined(value2)) {
            acc[`- ${key}`] = makeDeepNode(value1, spaceCount);
          }
          if (_.isPlainObject(value2) && _.isUndefined(value1)) {
            acc[`+ ${key}`] = makeDeepNode(value2, spaceCount);
          }
          if (value1 !== value2) {
            if (_.isPlainObject(value1)) {
              acc[`- ${key}`] = makeDeepNode(value1, spaceCount);
              acc[`+ ${key}`] = value2;
            } else {
              acc[`- ${key}`] = value1;
              acc[`+ ${key}`] = makeDeepNode(value2, spaceCount);
            }
          }
          return acc;
        }
        if (_.has(obj2, key) && !_.has(obj1, key)) acc[`+ ${key}`] = value2;
        if (value1 === value2) acc[`${' '.repeat(spaceCount)}${key}`] = value1;
        if (value1 !== value2 && _.has(obj2, key)) {
          acc[`- ${key}`] = value1;
          acc[`+ ${key}`] = value2;
        }
        if (_.has(obj1, key) && !_.has(obj2, key)) acc[`- ${key}`] = value1;
        return acc;
      }, {});
  };

  const parsedData1 = getParsedData(o1);
  const parsedData2 = getParsedData(o2);
  const jsonString = JSON.stringify(genDeepDiff(parsedData1, parsedData2), null, 4);

  return jsonString
    .replace(/("|,)/g, '')
    .replace(/^((?!\}).)*$/gm, (subStr) => subStr.replace(/^\s{2}/g, ''));
};
