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

const buildNode = (action) => () => {
	switch (action) {
		case 'added':

		case 'deleted':
			
		case 'nested':
			
		case 'updated':
			
		case 'equal':
			
		default:
			throw Error(`Unknow action: "${action}"`);
	}
};

const actions = {
	added: buildNode('added'),
	deleted: buildNode('deleted'),
	nested: buildNode('nested'),
	updated: buildNode('updated'),
	equal: buildNode('equal'),
};

const buildAST = (o1, o2) => getSortedKeys(o1, o2).reduce((acc, key) => {
	const val1 = _.get(o1, key, {});
	const val2 = _.get(o2, key, {});
	const actionType = getAction(val1, val2);
	actions[actionType]();
	return acc;
}, {});

export default getSortedKeys;
