'use strict';

const kt = require('katex');
const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm,{delimiters:'brackets'});
const str = ` \\(abc\\)`;

// overwrite texmath render function (suppressing katex)
//tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
