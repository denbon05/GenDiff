import buildDiffAST from '../ast.js';

export default (obj1, obj2) => {
  const diffAST = buildDiffAST(obj1, obj2);
  const getDataAST = (ast) => Object.keys(ast).reduce((acc, key) => {
    const {
      children, status, value, oldValue,
    } = ast[key];
    if (status === 'added' || status === 'deleted') return [...acc, { key, status, value }];
    if (status === 'updated') {
      return [...acc, {
        key, status, oldValue, value,
      }];
    }
    if (status === 'nested') {
      return [...acc, { key, status, children: getDataAST(children) }];
    }
    return acc;
  }, []);
  const nestedDiff = getDataAST(diffAST);
  return JSON.stringify(nestedDiff);
};
