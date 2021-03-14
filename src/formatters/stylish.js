import _ from 'lodash';

const normalizeObj = (obj) => {
  if (!_.isPlainObject(obj)) return `${obj}`;
  return Object.keys(obj)
    .reduce((acc, k) => ({ ...acc, [`  ${k}`]: normalizeObj(obj[k]) }), {});
};

const normalizeValue = (val) => (_.isPlainObject(val) ? normalizeObj(val) : val);

export default (diffAST) => {
  const getStylishDiff = (ast) => {
    const keys = Object.keys(ast);
    return keys.reduce((acc, key) => {
      const {
        value: val, oldValue: oldVal, status, children,
      } = ast[key];
      const oldValue = normalizeValue(oldVal);
      const value = normalizeValue(val);
      switch (status) {
        case 'nested':
          return { ...acc, [`  ${key}`]: getStylishDiff(children) };
        case 'equal':
          return { ...acc, [`  ${key}`]: value };
        case 'added':
          return { ...acc, [`+ ${key}`]: value };
        case 'deleted':
          return { ...acc, [`- ${key}`]: value };
        case 'updated':
          return { ...acc, [`- ${key}`]: oldValue, [`+ ${key}`]: value };
        default:
          throw Error(`Unknow status: "${status}"`);
      }
    }, {});
  };
  const diff = getStylishDiff(diffAST);
  const jsonString = JSON.stringify(diff, null, 4);
  return jsonString
    .replace(/("|,)/g, '')
    .replace(/^((?!\}).)*$/gm, (subStr) => subStr.replace(/^\s{2}/g, ''));
};
