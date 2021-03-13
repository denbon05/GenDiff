import renderStylishFormat from './stylish.js';
import renderPlainFormat from './plain.js';
import renderJsonForamt from './json.js';

export default (format, ast) => {
  switch (format) {
    case 'stylish':
      return renderStylishFormat(ast);
    case 'plain':
      return renderPlainFormat(ast);
    case 'json':
      return renderJsonForamt(ast);
    default:
      throw Error(`Unknow format: "${format}"`);
  }
};
