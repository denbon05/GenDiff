export default (diffAST) => {
  // return JSON.stringify(diffAST);
  // const getDataAST = (ast) => Object.values(ast).reduce((acc, val, idx) => {
  //   if (val.status === 'equal') return acc;
  //   if (val.status === 'nested') {
  //     return [...acc, { key: val.key, status: val.status, children: getDataAST(val.children) }];
  //   }
  //   return [...acc, val];
  // }, []);
  // return JSON.stringify(getDataAST(diffAST));
  // console.log('diffAST>>>', JSON.stringify(diffAST, null, 2));
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
