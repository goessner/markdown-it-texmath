'use strict';

const tm = require('../texmath.js');
//const md = require('markdown-it')({html:true}).use(tm,{engine:require('katex'), delimiters:'dollars'});
const md = require('markdown-it')({html:true}).use(tm,{engine:require('katex'), delimiters:'gitlab'});
const str = `
With 

> \`\`\`math 
>  x 
>  \`\`\`
`;

// overwrite texmath render function (suppressing katex)
// tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
