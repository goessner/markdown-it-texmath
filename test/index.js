'use strict';

const fs = require('fs');
const kt = require('katex');
const tm = require('../texmath.js').use(kt);
const md = require('markdown-it')({html:true}).use(tm);
const tests = require('./tests.js');

const html = (content) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>markdown-it-texmath Tests</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css"> <!-- version is necessary here -->
    <link rel="stylesheet" href="https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/css/texmath.css">
    <style>
       body {
          color: darkslategray;
          background-color: cornsilk;
        	max-width: 40rem;
          margin: 2rem;
       }
       a {
          color: orangered;
       }
      .inverse {
          color: cornsilk;
          background-color: darkslategray;
      }
      td, th { border: 1px solid black; white-space:pre; font:12px monospace; overflow:hidden; text-overflow: ellipsis; padding:3px; }
      th { font-weight:bold; }

      eq, eqn { background-color:antiquewhite; }
    </style>
  </head>
  <body>
    <h1>markdown-it-texmath Tests</h1>
    <table id="test-table" style="table-layout:fixed; border:solid black 1px; border-collapse: collapse; max-width:100%;">
      <thead>
        <tr>
          <th style="width:20px">i</th>
          <th style="width:20px">valid</th>
          <th style="width:250px;max-width:250px">src</th>
          <th style="width:201px">render</th>
          <th style="width:201px">comment</th>
        </tr>
        ${content}
      </thead>
      <tbody id="rows">
      </tbody>
    </table>
  </body>
</html>`;
const row = (i, valid, src, comment) => 
`   <tr id="#${i}">
      <td style="text-align:right;">${i}</td>
      <td style="text-align:center;">${valid ? "&#128522;" : "&#128545;"}</td>
      <td style="text-align:left;">${src.replace("<","&lt;")}</td>
      <td style="text-align:left;">${md.render(src)}</td>
      <td style="text-align:left;">${comment}</td>
    </tr>
`;
let content = "";

//tm.render = function(tex,isblock) { return tex; }

for (let i=0, n=tests.length; i<n; i++)
    content += row(i, tests[i].valid, tests[i].src, tests[i].comment);

fs.writeFile("index.html", html(content), function(err) { if(err) return console.log(err); });
