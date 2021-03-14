const normalizeValue = (value) => {
  if (typeof value === 'object' && value !== null) return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const genString = (propPath, action, value = '', oldValue = '') => {
  const val = normalizeValue(value);
  const oldVal = normalizeValue(oldValue);
  const path = propPath.join('.');
  switch (action) {
    case 'added':
      return `Property '${path}' was ${action} with value: ${val}`;
    case 'deleted':
      return `Property '${path}' was removed`;
    case 'updated':
      return `Property '${path}' was ${action}. From ${oldVal} to ${val}`;
    default:
      throw Error(`Unknow case action: ${action}`);
  }
};

export default (diffAST) => {
  const getPlainDiff = (ast, path = []) => Object.keys(ast)
    .reduce((acc, key) => {
      const {
        value, oldValue, status, children,
      } = ast[key];
      if (status === 'equal') return acc;
      const propPath = [...path, key];
      if (status === 'nested') return [...acc, ...getPlainDiff(children, propPath)];
      const infoLine = genString(propPath, status, value, oldValue);
      return [...acc, infoLine];
    }, []);
  const plainDiff = getPlainDiff(diffAST);
  return plainDiff.join('\n');
};
