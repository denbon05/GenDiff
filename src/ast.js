import _ from 'lodash';

const isSimpleValue = (val) => _.isString(val) || _.isBoolean(val)
|| _.isInteger(val) || _.isNull(val) || _.isNaN(val);

const isComplex = (value) => _.isPlainObject(value) && !_.isEmpty(value);
const isExist = (val) => !_.isEmpty(val) || isSimpleValue(val);

const getSortedKeys = (o1, o2) => {
  const keys = _.union(Object.keys(o1), Object.keys(o2));
  return _.sortBy(keys);
};

const getAction = (o1, o2) => {
  if (!isExist(o1) && isExist(o2)) return 'added';
  if (isExist(o1) && !isExist(o2)) return 'deleted';
  if (isComplex(o1) && isComplex(o2)) return 'nested';
  if (isExist(o1) && isExist(o2) && !_.isEqual(o1, o2)) return 'updated';
  return 'equal';
};

const buildDiffAST = (obj1, obj2) => {
  const buildNode = (status) => (o1, o2, key) => {
    switch (status) {
      case 'added':
        return {
          status, key, value: o2,
        };
      case 'deleted':
        return {
          status, key, value: o1,
        };
      case 'nested':
        return {
          status, key, children: buildDiffAST(o1, o2),
        };
      case 'updated':
        return {
          status, key, oldValue: o1, value: o2,
        };
      case 'equal':
        return {
          status, key, value: o1,
        };
      default:
        throw Error(`Unknow action: "${status}"`);
    }
  };

  const actions = {
    added: buildNode('added'),
    deleted: buildNode('deleted'),
    nested: buildNode('nested'),
    updated: buildNode('updated'),
    equal: buildNode('equal'),
  };

  return getSortedKeys(obj1, obj2).reduce((acc, key) => {
    const val1 = _.get(obj1, key, {});
    const val2 = _.get(obj2, key, {});
    const actionType = getAction(val1, val2);
    return { ...acc, [key]: actions[actionType](val1, val2, key) };
  }, {});
};

export default buildDiffAST;
