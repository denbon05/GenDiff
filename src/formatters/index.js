import renderStylishFromat from './stylish.js';
import renderPlainFromat from './plain.js';

export default (format, data1, data2) => {
  switch (format) {
    case 'stylish':
      return renderStylishFromat(data1, data2);
    case 'plain':
      return renderPlainFromat(data1, data2);
    default:
      throw Error(`Unknow format: "${format}"`);
  }
};
