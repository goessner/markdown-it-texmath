'use strict';

const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm, { engine: require('katex'),
                                                         delimiters: 'dollars',
                                                         outerSpace: true,
                                                         katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } });
const str = "Euler\'s identity $e^{i\\pi}+1=0$ is a beautiful formula in $\\RR^2$.";

// overwrite texmath render function (suppressing katex)
// tm.render = function(tex, isblock) { return tex; }

console.log(md.render(str));
