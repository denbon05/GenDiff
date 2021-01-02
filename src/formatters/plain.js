import _ from 'lodash';
import buildDiffAST from '../ast.js';

const normalizeValue = (val) => {
  if (_.isPlainObject(val)) return '[complex value]';
  if (_.isBoolean(val) || _.isNull(val) || _.isInteger(val)) return val;
  return `'${val}'`;
};

const genString = (action) => (propPath, value = '', oldValue = '') => {
  const val = normalizeValue(value);
  const oldVal = normalizeValue(oldValue);
  const path = propPath.join('.');
  switch (action) {
    case 'added':
      return `Property '${path}' was ${action} with value: ${val}`;
    case 'removed':
      return `Property '${path}' was ${action}`;
    case 'updated':
      return `Property '${path}' was ${action}. From ${oldVal} to ${val}`;
    default:
      throw Error(`Unknow case action: ${action}`);
  }
};

const actions = {
  added: genString('added'),
  deleted: genString('removed'),
  updated: genString('updated'),
};

export default (obj1, obj2) => {
  const diffAST = buildDiffAST(obj1, obj2);
  const getPlainDiff = (ast, path = []) => Object.keys(ast)
    .reduce((acc, key) => {
      const {
        value, oldValue, status, children,
      } = ast[key];
      if (status === 'equal') return acc;
      const propPath = [...path, key];
      if (status === 'nested') return [...acc, ...getPlainDiff(children, propPath)];
      const infoLine = actions[status](propPath, value, oldValue);
      return [...acc, infoLine];
    }, []);
  const plainDiff = getPlainDiff(diffAST);
  return plainDiff.join('\n');
};
