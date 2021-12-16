'use strict';
const tm = require('../texmath.js');
const md = require('markdown-it')({html:true})
                  .use(tm, { engine: require('katex'),
                             delimiters: 'dollars',
                             katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } });
const str =
`
something

$$\\bold r =\\begin\{pmatrix\}x_1 \\\\ x_2 \\end\{pmatrix\}$$

`;

console.log(md.render(str));
