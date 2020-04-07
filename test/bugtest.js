'use strict';

const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm,{engine:require('katex'), delimiters:'pandoc'});
const str = `
With $$a+b2$$ for all a,b,c \in \mathbb{R} used 
`;

// overwrite texmath render function (suppressing katex)
// tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
