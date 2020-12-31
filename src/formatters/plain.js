import _ from 'lodash';

const normalizeValue = (val) => {
  if (_.isPlainObject(val)) return '[complex value]';
  if (_.isBoolean(val) || _.isNull(val)) return val;
  return `'${val}'`;
};

const genString = (action) => (propPath, value = '', oldValue = '') => {
  const val = normalizeValue(value);
  const oldVal = normalizeValue(oldValue);
  switch (action) {
    case 'added':
      return `Property '${propPath}' was ${action} with value: ${val}`;
    case 'removed':
      return `Property '${propPath}' was ${action}`;
    case 'updated':
      return `Property '${propPath}' was ${action}. From ${oldVal} to ${val}`;
    default:
      throw Error(`Unknow case action: ${action}`);
  }
};

const getPaths = (obj) => {
  const keys = Object.keys(obj);
  const buildPath = (currentObj, pathStr, acc) => {
    acc.push(pathStr);
    const lastKey = _.last(pathStr);
    const value = currentObj[lastKey];
    if (_.isPlainObject(value)) {
      Object.keys(value)
        .forEach((k) => {
          buildPath(value, [...pathStr, k], acc);
        });
    }
  };
  return keys.reduce((acc, key) => {
    buildPath(obj, [key], acc);
    return acc;
  }, []).map((str) => str.join('.')).sort();
};

const actions = {
  add: genString('added'),
  remove: genString('removed'),
  update: genString('updated'),
};

const isBouthComplex = (obj1, obj2, path) => {
  const isComplex1 = _.isPlainObject(_.get(obj1, path));
  const isComplex2 = _.isPlainObject(_.get(obj2, path));
  return isComplex1 && isComplex2;
};

const getAction = (o1, o2, path) => {
  if (_.has(o2, path) && !_.has(o1, path)) return 'add';
  if (_.has(o2, path) && _.has(o1, path)) {
    if (!_.isEqual(_.get(o2, path), _.get(o1, path)) && !isBouthComplex(o1, o2, path)) {
      return 'update';
    }
  }
  if (!_.has(o2, path) && _.has(o1, path)) return 'remove';
  return null;
};

export default (obj1, obj2) => {
  const pathsObj1 = getPaths(obj1);
  const pathsObj2 = getPaths(obj2);
  const allPaths = _.union(pathsObj1, pathsObj2);
  const differenceStrings = allPaths
    .sort()
    .reduce((acc, path) => {
      const actionType = getAction(obj1, obj2, path);
      const val1 = _.get(obj1, path);
      const val2 = _.get(obj2, path);
      if (!_.isNull(actionType)) {
        acc.push(actions[actionType](path, val2, val1));
        allPaths.forEach((line, i) => {
          if (line.includes(path) && line.length > path.length) allPaths[i] = '';
        });
      }
      return acc;
    }, []);
  return differenceStrings.join('\n');
};
