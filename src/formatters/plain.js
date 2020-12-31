import _ from 'lodash';

const genString = (action) => (propPath, value = '', oldValue = '') => {
	const val = _.isPlainObject(value) ? '[complex value]' :
		_.isBoolean(value) || _.isNull(value) ? value : `'${value}'`;
	const oldVal = _.isPlainObject(oldValue) ? '[complex value]' :
		_.isBoolean(oldValue) || _.isNull(oldValue) ? oldValue : `'${oldValue}'`;
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
				allPaths.forEach((line, i, arr) => {
					if (line.includes(path) && line.length > path.length) arr[i] = '';
				});
			}
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
