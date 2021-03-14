export default (diffAST) => {
  const getDataAST = (ast) => Object.values(ast).reduce((acc, val) => {
    if (val.status === 'equal') return acc;
    if (val.status === 'nested') {
      return [...acc, { key: val.key, status: val.status, children: getDataAST(val.children) }];
    }
    return [...acc, val];
  }, []);
  return JSON.stringify(getDataAST(diffAST));
};
