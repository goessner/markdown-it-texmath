'use strict';
const katex = require('katex');
const str = katex.renderToString("x", {
    throwOnError: false
});
console.log(str);
