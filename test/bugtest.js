'use strict';

const kt = require('katex');
const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm);
const str = `so what-is $x$ or $y$`;

// overwrite texmath render function (suppressing katex)
//tm.render = function(tex,isblock) { return tex; }

//console.log(md.render(``));
console.log(md.render(str));
