import renderStylishFormat from './stylish.js';
import renderPlainFormat from './plain.js';
import renderJsonForamt from './json.js';

export default (format, data1, data2) => {
  switch (format) {
    case 'stylish':
      return renderStylishFormat(data1, data2);
    case 'plain':
      return renderPlainFormat(data1, data2);
    case 'json':
      return renderJsonForamt(data1, data2);
    default:
      throw Error(`Unknow format: "${format}"`);
  }
};
