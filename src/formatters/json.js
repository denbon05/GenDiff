import _ from 'lodash';
import getSortedKeys from '../ast.js';

const isSimpleValue = (val) => _.isString(val) || _.isBoolean(val)
|| _.isInteger(val) || _.isNull(val) || _.isNaN(val);

const isComplex = (value) => _.isPlainObject(value) && !_.isEmpty(value);
const isExist = (val) => !_.isEmpty(val) || isSimpleValue(val);

const getStatus = (o1, o2) => {
  if (!isExist(o1) && isExist(o2)) return 'added';
  if (isExist(o1) && !isExist(o2)) return 'deleted';
  if (isComplex(o1) && isComplex(o2)) return 'nested';
  if (isExist(o1) && isExist(o2) && !_.isEqual(o1, o2)) return 'updated';
  return 'equal';
};

export default (obj1, obj2) => {
  const getDiff = (o1, o2) => getSortedKeys(o1, o2)
    .reduce((acc, key) => {
      if (!_.isEqual(o1, o2)) {
        const val1 = _.get(o1, key, {});
        const val2 = _.get(o2, key, {});
        const status = getStatus(val1, val2);
        switch (status) {
          case 'nested':
            return [...acc, { key, status, children: getDiff(val1, val2) }];
          case 'added':
            return [...acc, { key, status, value: val2 }];
          case 'deleted':
            return [...acc, { key, status, value: val1 }];
          case 'updated':
            return [...acc, {
              key, status, oldValue: val1, value: val2,
            }];
          case 'equal': return acc;
          default:
            throw Error(`Unexpected status: ${status}`);
        }
      }
      return acc;
    }, []);
  const nestedDiff = getDiff(obj1, obj2);
  return JSON.stringify(nestedDiff);
};
