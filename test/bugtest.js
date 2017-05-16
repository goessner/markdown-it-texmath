'use strict';

const kt = require('katex');
const tm = require('../texmath.js');
const md = require('markdown-it')({html:true}).use(tm);
const tests = require('./tests.js');
const str = `
some $x^2 + y^2 = r^2$ with
<p>
$\\phi$
</p>
`;

// overwrite texmath render function (suppressing katex)
//tm.render = function(tex,isblock) { return tex; }

//console.log(md.render(``));
console.log(md.render(str));
