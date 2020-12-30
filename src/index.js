import formatOutput from './formatters/index.js';

import getParsedData from './parsers/parser.js';

export default (o1, o2, formatName = 'stylish') => {
  const parsedData1 = getParsedData(o1);
  const parsedData2 = getParsedData(o2);
  return formatOutput(formatName, parsedData1, parsedData2);
};
