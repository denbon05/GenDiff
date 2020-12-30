import _ from 'lodash';

const genString = (action) => (propPath, value, oldValue = '') => {
	const val = _.isPlainObject(value) ? "[complex value]" : `'${value}'`;
	const oldVal =  _.isPlainObject(oldValue) ? "[complex value]" : `'${oldValue}'`;
	switch (action) {
		case 'added':
			return `Property ${propPath} was ${action} with value: ${val}`;
		case 'removed':
			return `Property ${propPath} was ${action}`;
		case 'updated':
			return `Property ${propPath} was ${action}. From ${oldVal} to ${val}`;
		default:
			throw Error(`Unknow case action: ${action}`);
	};
};

const getPaths = (obj) => {
  const keys = Object.keys(obj);
  const buildPath = (currentObj, pathStr, acc) => {
    acc.push(pathStr);
    const lastKey = _.last(pathStr);
    const value = currentObj[lastKey];
    if (_.isPlainObject(value)) {
      return Object.keys(value)
        .forEach((k) => {
          buildPath(value, [...pathStr, k], acc)
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

const getDifference = (obj1, obj2) => {
	const pathsObj1 = getPaths(obj1);
	const pathsObj2 = getPaths(obj2);
	const differenceStrings = pathsObj1.reduce((acc, path) => {
		if (_.has(obj2, path)) acc.push()
			
		return acc;
	}, []);
};

export default (o1, o2) => {
	return getDifference(o1, o2);
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