/* eslint-disable */

var path = require('path');
var fs = require('fs');

// NOTE: This is temporary and will only be used until sgnbuild is fixed.
var existing = fs.readFileSync('./bin/index.js').toString().split('\n').filter(function(line) {
  return line !== '#!/usr/bin/env node';
});
fs.writeFileSync('./bin/index.js', existing.join('\n'));

module.exports = {
  entry: './bin/index.js',
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'bundle.js'
  }
};
