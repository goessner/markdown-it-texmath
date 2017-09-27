'use strict';

const kt = require('katex');
const tm = require('../texmath.js').use(kt);
const md = require('markdown-it')({html:true}).use(tm,{delimiters:'gitlab'});
const str = `\`\`\`math
\\begin{aligned} 
  a&=b+c \\\\ 
  d+e&=f 
\\end{aligned}
\`\`\``;

// overwrite texmath render function (suppressing katex)
//tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
