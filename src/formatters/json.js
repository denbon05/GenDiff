import _ from 'lodash';

const isComplex = (value) => _.isPlainObject(value) && !_.isEmpty(value);
const isExist = (val) => isComplex(val) || _.isString(val) || _.isBoolean(val);

const getStatus = (o1, o2) => {
	if (!isExist(o1) && isExist(o2)) return 'added';
	if (isExist(o1) && !isExist(o2)) return 'deleted';
	if (isComplex(o1) && isComplex(o2)) return 'nested';
	if (isExist(o1) && isExist(o2) && !_.isEqual(o1, o2)) return 'updated';
	return 'equal';
};

const getSortedKeys = (o1, o2) => _.union(Object.keys(o1), Object.keys(o2)).sort();

const getDiff = (o1, o2) => {
	return getSortedKeys(o1, o2)
		.reduce((acc, key) => {
			if (!_.isEqual(o1, o2)) {
				const val1 = _.get(o1, key, {});
				const val2 = _.get(o2, key, {});
				// console.log('val1=>', val1);
				// console.log('val2=>', val2);
				const status = getStatus(val1, val2);
				console.log('status+>', status);
				switch (status) {
					case 'nested':
						return [...acc, { key, status, children: getDiff(val1, val2) }];
					case 'added':
						return [...acc, { key, status, value: val2 }];
					case 'deleted':
						return [...acc, { key, status, value: val1 }];
					case 'updated':
						return [...acc, { key, status, oldValue: val1, value: val2 }];
					default:
						return acc;
				}
			}
		}, []);
};

export default getDiff;
