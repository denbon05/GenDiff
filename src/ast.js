// @ts-check

import _ from 'lodash';

const isSimpleValue = (value) => _.isString(value) || _.isBoolean(value)
|| _.isInteger(value) || _.isNull(value) || _.isNaN(value);

const isComplex = (value) => _.isPlainObject(value) && !_.isEmpty(value);
const isExist = (value) => !_.isEmpty(value) || isSimpleValue(value);

const getSortedKeys = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  return _.sortBy(keys);
};

const getAction = (node1, node2) => {
  if (!isExist(node1) && isExist(node2)) return 'added';
  if (isExist(node1) && !isExist(node2)) return 'deleted';
  if (isComplex(node1) && isComplex(node2)) return 'nested';
  if (isExist(node1) && isExist(node2) && !_.isEqual(node1, node2)) return 'updated';
  return 'equal';
};

const buildAST = (data1, data2) => {
  const buildNode = (child1, child2, key, status) => {
    switch (status) {
      case 'added':
        return {
          status, key, value: child2,
        };
      case 'deleted':
        return {
          status, key, value: child1,
        };
      case 'nested':
        return {
          status, key, children: buildAST(child1, child2),
        };
      case 'updated':
        return {
          status, key, oldValue: child1, value: child2,
        };
      case 'equal':
        return {
          status, key, value: child1,
        };
      default:
        throw Error(`Unknow action: "${status}"`);
    }
  };

  return getSortedKeys(data1, data2).reduce((acc, key) => {
    const child1 = _.get(data1, key, {});
    const child2 = _.get(data2, key, {});
    const actionType = getAction(child1, child2);
    return { ...acc, [key]: buildNode(child1, child2, key, actionType) };
  }, {});
};

export default buildAST;
