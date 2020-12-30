import _ from 'lodash';

export default (o1, o2) => {
  const spaceCount = 2;

  const makeNode = (node) => {
    const keys = Object.keys(node);
    return keys.reduce((acc, key) => {
      const value = node[key];
      if (_.isPlainObject(value)) {
        acc[`${' '.repeat(spaceCount)}${key}`] = makeNode(value);
      } else acc[`${' '.repeat(spaceCount)}${key}`] = value;
      return acc;
    }, {});
  };

  const genDeepDiff = (obj1, obj2) => {
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
          acc[`${' '.repeat(spaceCount)}${key}`] = genDeepDiff(value1, value2);
          return acc;
				}
				if (_.isPlainObject(value1) || _.isPlainObject(value2)) {
          if (_.isPlainObject(value1) && _.isUndefined(value2)) {
            acc[`- ${key}`] = makeNode(value1);
          }
          if (_.isPlainObject(value2) && _.isUndefined(value1)) {
            acc[`+ ${key}`] = makeNode(value2);
          }
          if (value1 !== value2) {
            if (_.isPlainObject(value1)) {
              acc[`- ${key}`] = makeNode(value1);
              acc[`+ ${key}`] = value2;
            } else {
              acc[`- ${key}`] = value1;
              acc[`+ ${key}`] = makeNode(value2);
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

  const jsonString = JSON.stringify(genDeepDiff(o1, o2), null, spaceCount + 2);

  return jsonString
    .replace(/("|,)/g, '')
    .replace(/^((?!\}).)*$/gm, (subStr) => subStr.replace(/^\s{2}/g, ''));
};
