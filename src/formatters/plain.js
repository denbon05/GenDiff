import _ from 'lodash';

const genString = (action) => (propPath, value = '', oldValue = '') => {
  const val = _.isPlainObject(value) ? '[complex value]' : `'${value}'`;
  const oldVal = _.isPlainObject(oldValue) ? '[complex value]' : `'${oldValue}'`;
  switch (action) {
    case 'added':
      return `Property ${propPath} was ${action} with value: ${val}`;
    case 'removed':
      return `Property ${propPath} was ${action}`;
    case 'updated':
      return `Property ${propPath} was ${action}. From ${oldVal} to ${val}`;
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

const getAction = (o1, o2, path) => {
  if (_.has(o2, path) && !_.has(o1, path)) return 'add';
  if (_.has(o2, path) && _.has(o1, path)) {
    return _.isEqual(_.get(o2, path), _.get(o1, path)) ? null : 'update';
  }
  return 'remove';
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
			if (!_.isNull(actionType)) acc.push(actions[actionType](path, val1, val2));
      return acc;
    }, []);
  return differenceStrings.join('\n');
};

// Property 'common.follow' was added with value: false
// Property 'common.setting2' was removed
// Property 'common.setting3' was updated. From true to null
// Property 'common.setting4' was added with value: 'blah blah'
// Property 'common.setting5' was added with value: [complex value]
// Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
// Property 'common.setting6.ops' was added with value: 'vops'
// Property 'group1.baz' was updated. From 'bas' to 'bars'
// Property 'group1.nest' was updated. From [complex value] to 'str'
// Property 'group2' was removed
// Property 'group3' was added with value: [complex value]
