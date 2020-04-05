'use strict';

const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm,{engine:require('katex'), delimiters:'dollars'});
const str = `#Math test

$$ abc^2 $$`;

// overwrite texmath render function (suppressing katex)
// tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
