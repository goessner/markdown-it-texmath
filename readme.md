[![License](https://img.shields.io/github/license/goessner/markdown-it-texmath.svg)](https://github.com/goessner/markdown-it-texmath/blob/master/licence.txt)
[![npm](https://img.shields.io/npm/v/markdown-it-texmath.svg)](https://www.npmjs.com/package/markdown-it-texmath)
[![npm](https://img.shields.io/npm/dt/markdown-it-texmath.svg)](https://www.npmjs.com/package/markdown-it-texmath)

# markdown-it-texmath

Add TeX math equations to your Markdown documents rendered by [markdown-it](https://github.com/markdown-it/markdown-it) parser. [KaTeX](https://github.com/Khan/KaTeX) is used as a fast math renderer.

## Features
Simplify the process of authoring markdown documents containing math formulas.
This extension is a comfortable tool for scientists, engineers and students with markdown as their first choice document format.

* Inline math by `$ ... $`
* Display math by `$$ ... $$`
* Add formula numbering by `$$ ... $$ (1)`
* Inline math with tables, lists and blockquote.


## Show me 

[try ...](https://goessner.github.io/markdown-it-texmath/markdown-it-texmath-demo.html)

## Use with `node.js`

Install the extension.
```
npm install markdown-it-texmath
```
Use it with JavaScript.
```js
let tm = require('markdown-it-texmath'),
    md = require('markdown-it')().use(tm);

md.render('Euler\'s identity $e^{i\pi}+1=0$ is a beautiful formula.')
```

## Use in Browser
```html
<html>
<head>
  <meta charset='utf-8'>
  <link rel="stylesheet" href="github-markdown.min.css">
  <link rel="stylesheet" href="katex.min.css">
  <link rel="stylesheet" href="texmath.css">
  <script src="markdown-it.min.js"></script>
  <script src="katex.min.js"></script>
  <script src="texmath.js"></script>
</head>
<body>
  <div id="out" class="markdown-body"></div>
  <script>
    let md, kt, tm;
    document.addEventListener("DOMContentLoaded", () => {
        kt = katex,
        tm = texmath;
        md = markdownit().use(tm);
        out.innerHTML = md.render('Euler\'s identity $e^{i\pi}+1=0$ is a beautiful formula.');
  </script>
</body>
</html>
```
## CDN

Use following links for `texmath.js` and `texmath.css`
* `https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.js`
* `https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.css`

## Dependencies

* [`markdown-it`](https://github.com/markdown-it/markdown-it): Markdown parser done right. Fast and easy to extend.
* [`katex`](https://github.com/Khan/KaTeX): This is where credits for fast rendering TeX math in HTML go to.

## ToDo

* Allow additional math delimiter.
* Integrate `markdown-it-texmath` into [`mdmath`](https://github.com/goessner/mdmath).

## License

*Markdown+Math* for VS Code is licensed under the [MIT License](./license.txt)

 © [Stefan Gössner](https://github.com/goessner)
