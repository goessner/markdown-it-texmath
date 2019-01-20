'use strict';

const kt = require('katex');
const tm = require('../texmath.js').use(kt);
const md = require('markdown-it')({html:true}).use(tm,{delimiters:'dollars'});
const str = `**fff**
$$ abc
 > $$ a^2 efg`;

// overwrite texmath render function (suppressing katex)
// tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
