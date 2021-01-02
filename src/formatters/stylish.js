import _ from 'lodash';
import buildDiffAST from '../ast.js';

const normalizeObj = (obj) => {
  if (!_.isPlainObject(obj)) return `${obj}`;
  return Object.keys(obj)
    .reduce((acc, k) => ({ ...acc, [`  ${k}`]: normalizeObj(obj[k]) }), {});
};

const normalizeValue = (val) => (_.isPlainObject(val) ? normalizeObj(val) : val);

export default (obj1, obj2) => {
  const diffAST = buildDiffAST(obj1, obj2);
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

// export default (o1, o2) => {
//   const spaceCount = 2;

//   const makeNode = (node) => {
//     const keys = Object.keys(node);
//     return keys.reduce((acc, key) => {
//       const value = node[key];
//       if (_.isPlainObject(value)) {
//         acc[`${' '.repeat(spaceCount)}${key}`] = makeNode(value);
//       } else acc[`${' '.repeat(spaceCount)}${key}`] = value;
//       return acc;
//     }, {});
//   };

//   const genDeepDiff = (obj1, obj2) => getSortedKeys(obj1, obj2).reduce((acc, key) => {
//     const value1 = obj1[key];
//     const value2 = obj2[key];
//     if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
//       acc[`${' '.repeat(spaceCount)}${key}`] = genDeepDiff(value1, value2);
//       return acc;
//     }
//     if (_.isPlainObject(value1) || _.isPlainObject(value2)) {
//       if (_.isPlainObject(value1) && _.isUndefined(value2)) {
//         acc[`- ${key}`] = makeNode(value1);
//       }
//       if (_.isPlainObject(value2) && _.isUndefined(value1)) {
//         acc[`+ ${key}`] = makeNode(value2);
//       }
//       if (value1 !== value2) {
//         if (_.isPlainObject(value1)) {
//           acc[`- ${key}`] = makeNode(value1);
//           acc[`+ ${key}`] = value2;
//         } else {
//           acc[`- ${key}`] = value1;
//           acc[`+ ${key}`] = makeNode(value2);
//         }
//       }
//       return acc;
//     }
//     if (_.has(obj2, key) && !_.has(obj1, key)) acc[`+ ${key}`] = value2;
//     if (value1 === value2) acc[`${' '.repeat(spaceCount)}${key}`] = value1;
//     if (value1 !== value2 && _.has(obj2, key)) {
//       acc[`- ${key}`] = value1;
//       acc[`+ ${key}`] = value2;
//     }
//     if (_.has(obj1, key) && !_.has(obj2, key)) acc[`- ${key}`] = value1;
//     return acc;
//   }, {});

//   const jsonString = JSON.stringify(genDeepDiff(o1, o2), null, spaceCount + 2);

//   return jsonString
//     .replace(/("|,)/g, '')
//     .replace(/^((?!\}).)*$/gm, (subStr) => subStr.replace(/^\s{2}/g, ''));
// };
