[![License](https://img.shields.io/github/license/goessner/markdown-it-texmath.svg)](https://github.com/goessner/markdown-it-texmath/blob/master/licence.txt)
[![npm](https://img.shields.io/npm/v/markdown-it-texmath.svg)](https://www.npmjs.com/package/markdown-it-texmath)
[![npm](https://img.shields.io/npm/dt/markdown-it-texmath.svg)](https://www.npmjs.com/package/markdown-it-texmath)
[![](https://data.jsdelivr.com/v1/package/npm/markdown-it-texmath/badge)](https://www.jsdelivr.com/package/npm/markdown-it-texmath)

# markdown-it-texmath

Add TeX math equations to your Markdown documents rendered by [markdown-it](https://github.com/markdown-it/markdown-it) parser. [KaTeX](https://github.com/Khan/KaTeX) is used as a fast math renderer.

## What's New?
* `markdown-it-texmath` reached quite a stable state with version 1.0 .
* Native `begin{...}` / `end{...}` environments are supported as delimiters itself ... thanks to [William Stein](https://github.com/williamstein) for [proposing](https://github.com/goessner/markdown-it-texmath/issues/41).

  ```
  \begin{equation}
    a^2+b^2=c^2
  \end{equation}
  ```
  They can even be nested.
  ```
  \begin{equation}
    \begin{pmatrix}
      A & B \\ B & C
    \end{pmatrix} 
  \end{equation}
  ```

* Different delimiters can be merged. Delimiters options property supports array notation for that. Example: `delimiters: ['dollars','beg_end']`. Thanks to [Liu YongLiang](https://github.com/tlylt) for [proposing](https://github.com/goessner/markdown-it-texmath/issues/40).


## Features
Simplify the process of authoring markdown documents containing math formulas.
This extension is a comfortable tool for scientists, engineers and students with markdown as their first choice document format.

* Macro support
* Simple formula numbering
* Inline math with tables, lists and blockquote.
* User setting delimiters:
  * `'dollars'` (default)
    * inline: `$...$` or `$$...$$`
    * display: `$$...$$`
    * display + equation number: `$$...$$ (1)`
  * `'brackets'`
    * inline: `\(...\)`
    * display: `\[...\]`
    * display + equation number: `\[...\] (1)`
  * `'doxygen'`
    * inline: `\f$...$\f`
    * display: `\f[...\f]`
    * display + equation number: `\f[...\f] (1)`
  * `'gitlab'`
    * inline: ``$`...`$``
    * display: `` ```math ... ``` ``
    * display + equation number: `` ```math ... ``` (1)``
  * `'julia'`
    * inline: `$...$`  or ``` ``...`` ```
    * display: `` ```math ... ``` ``
    * display + equation number: `` ```math ... ``` (1)``
  * `'kramdown'`
    * inline: ``$$...$$``
    * display: `$$...$$`
    * display + equation number: `$$...$$ (1)`
  * `'beg_end'` (display math only)
    * inline: N/A
    * display: `begin{...}...end{...}`
    * display + equation number: N/A

## Show me 

View a [test table](https://goessner.github.io/markdown-it-texmath/index.html).

[try it out ...](https://goessner.github.io/markdown-it-texmath/markdown-it-texmath-demo.html)

## Use with `node.js`

Install the extension. Verify having `markdown-it` and `katex` already installed .
```
npm install markdown-it-texmath
```
Use it with JavaScript.
```js
const tm = require('markdown-it-texmath');
const md = require('markdown-it')({html:true})
                  .use(tm, { engine: require('katex'),
                             delimiters: 'dollars',
                             katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } });
const str = "Euler\'s identity $e^{i\\pi}+1=0$ is a beautiful formula in $\\RR^2$.";

md.render(str);
```

## Use in Browser
```html
<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <link  rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
  <link rel="stylesheet" href="../css/texmath.css">
  <script src="https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
  <script src="../texmath.js"></script>
  <title>test</title>
</head>
<body>
  <div id="out"></div>
  <script>
    const str = `"Euler\'s identity $e^{i\\pi}+1=0$ is a beautiful formula in $\\RR^2$."`
    document.addEventListener("DOMContentLoaded", () => {
        const md = markdownit({html:true})
                      .use(texmath, { engine: katex,
                                      delimiters: 'dollars',
                                      katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } } );
        out.innerHTML = md.render(str);
    })
  </script>
</body>
</html>
```
## CDN

Use following links for `texmath.js` and `texmath.css`
* `https://cdn.jsdelivr.net/npm/markdown-it-texmath/texmath.min.js`
* `https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css`

## Dependencies

* [`markdown-it`](https://github.com/markdown-it/markdown-it): Markdown parser done right. Fast and easy to extend.
* [`katex`](https://github.com/Khan/KaTeX): This is where credits for fast rendering TeX math in HTML go to.

## ToDo

 nothing yet

## FAQ

* __Support of inline syntax of display math ?__   
  * Inline syntax of display math with `dollars` mode is supported starting from version "0.7.0". So `'This formula $$a+b=c$$ will result in display math presentation'`, i.e. gets displayed on a separate line. For *true* inline math use `$..$` mode like before.

* __Multiline diplay math in `blockquote` block possible ?__   
  * Display math inside of `blockquote` blocks is able to span multiple lines with version "0.7.3".

* __`markdown-it-texmath` with React Native does not work, why ?__
  * `markdown-it-texmath` is using regular expressions with `y` [(sticky) property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky) and cannot avoid this. The use of the `y` flag in regular expressions means the plugin is not compatible with React Native (which as of now doesn't support it and throws an error `Invalid flags supplied to RegExp constructor`).

* __Why doesn't `markdown-it-texmath` work with other engines ?__
  * `markdown-it-texmath` is a personal project of mine. As it does very well with KaTeX what I want it to do, I offer it to the public as an open source plugin. I do not have time or interest to integrate other math engines.
  But if someone wants to help here out, pull requests are always welcome.

## CHANGELOG
###  [1.0.0] on May 28, 2022
* Update to KaTeX version `0.15.6`.
* Update to `markdown-it` `13.0.1`.
* [Bug fixed](https://github.com/goessner/markdown-it-texmath/pull/42) in level handling with `markdown-it`. Thanks to [williamstein](https://github.com/williamstein).
* [Bug fixed](https://github.com/goessner/markdown-it-texmath/pull/43) in mapping with `markdown-it`. Thanks to [williamstein](https://github.com/williamstein).
* Supporting native `begin{..}` / `end{...}` environments as delimiters itself. Thanks to [williamstein](https://github.com/williamstein) for [proposing](https://github.com/goessner/markdown-it-texmath/issues/41).
* Merging different delimiters for simultaneous use via `delimiters:[<delims1>, <delims2>]`. Thanks to [tlylt](https://github.com/tlylt) for [proposing](https://github.com/goessner/markdown-it-texmath/issues/40).

###  [0.9.7] on December 07, 2021
* Redundant `</math>` end-tag with display-mode equations removed. All modes were affected ... invisible effect though. Thanks to [yuanbug](https://github.com/yuanbug) for reporting.
###  [0.9.6] on November 16, 2021
* Small bug in 'dollars' inline-display-mode regex fixed.
###  [0.9.5] on November 12, 2021
* More Optimization done with the 'dollars' regexes.
###  [0.9.4] on November 12, 2021
* Optimizing the 'dollars' regexes. Thanks to [Erik Demaine](https://github.com/edemaine).
* Adding 'doxygen' delimiters support. ([#31](https://github.com/goessner/markdown-it-texmath/issues/31)). Thanks to [arwedus](https://github.com/arwedus).
###  [0.9.3] on October 28, 2021
* Fixing newline bug in 'dollars' regexes. ([#32](https://github.com/goessner/markdown-it-texmath/issues/32)).
###  [0.9.2] on October 27, 2021
* Fixing disability to include escaped dollar when using dollars delimiters ([#32](https://github.com/goessner/markdown-it-texmath/issues/32)).
###  [0.9.1] on July 02, 2021
* potential XSS vulnerability with equation numbers fixed ([#29](https://github.com/goessner/markdown-it-texmath/pull/29)).
###  [0.9.0] on May 26, 2021
* KaTeX options `{katexOptions:...}` within markdown-it-texmath options are directly handed over to katex. See [KaTeX options](https://katex.org/docs/options.html). Thanks to [Kirill](https://github.com/xuhcc) for [pull request](https://github.com/goessner/markdown-it-texmath/pull/19).
* Potential [error message XSS vulnerability](https://github.com/goessner/markdown-it-texmath/pull/22) fixed. Thanks to [CatNose](https://github.com/catnose99).
* Using new boolean markdown-it-texmath `outerSpace` option, inline rules `dollars` explicitly require surrounding spaces when set to `true` (default is `false` for backwards compatibility). This is primarily a guard against misinterpreting single `$`'s in normal markdown text.
* Update to KaTeX version 0.13.11.

###  [0.8.0] on July 10, 2020
* Infinite loop bug with `gitlab` mode and display math inside `blockquote` section removed.
* Fundamental redesign of display math implementation.
* Update to KaTeX version 0.12.0.

###  [0.7.2] on June 22, 2020
* Regex bug with `gitlab` mode removed.

###  [0.7.0] on June 14, 2020
* Experimental `pandoc` mode removed. Enhanced `dollars` mode now does, what `pandoc` mode was requiring.
* With `dollars` mode inline math expression `$$..$$` will result in display math presentation now. Adding equation numbers `$$..$$(1)` is not supported in inline syntax.
* Significant code redesign and regular expression optimization results in more compact code and performance gain ... not measured though.
* Bug with display math inside of `blockquote` blocks removed.

###  [0.6.9] on June 11, 2020
* Now display math inside of `blockquote` blocks can span multiple lines, provided that every line starts with a `>` character.
* Possible cause of [blockquote bug(https://github.com/goessner/mdmath/issues/50)] presumably eliminated.
* Update to `markdown-it` version 11.0.0

###  [0.6.7] on April 29, 2020
* Now supporting [katex options](https://katex.org/docs/options.html). Thanks goto [Kirill](https://github.com/xuhcc).

###  [0.6.6] on April 07, 2020
* Removed a small bug in activation method.

###  [0.6.5] on April 05, 2020
* Hand instance of `katex` over to `markdown-it-texmath` using `options.engine` object. Works with `node.js` and browsers. With `node.js` `options.engine` entry `{ engine:'katex' }` as a string also works.
* As a consequence of the topic before, the `use` method of `markdown-it-texmath` is deprecated now.
* Add beta support for [Pandoc](https://docs.julialang.org/en/v1/stdlib/Markdown/) syntax on [request](https://github.com/goessner/markdown-it-texmath/issues/18). Here waiting for test results.
* Using [jsdelivr](https://www.jsdelivr.com/package/npm/markdown-it-texmath?path=css) as cdn from now on.

###  [0.6.0] on October 04, 2019
* Add support for [Julia Markdown](https://docs.julialang.org/en/v1/stdlib/Markdown/) on [request](https://github.com/goessner/markdown-it-texmath/issues/15).

###  [0.5.5] on February 07, 2019
* Remove [rendering bug with brackets delimiters](https://github.com/goessner/markdown-it-texmath/issues/9).

###  [0.5.4] on January 20, 2019
* Remove pathological [bug within blockquotes](https://github.com/goessner/mdmath/issues/50).

###  [0.5.3] on November 11, 2018
* Add support for Tex macros (https://katex.org/docs/supported.html#macros) .
* Bug with [brackets delimiters](https://github.com/goessner/markdown-it-texmath/issues/9) .

###  [0.5.2] on September 07, 2018
* Add support for [Kramdown](https://kramdown.gettalong.org/) .

###  [0.5.0] on August 15, 2018
* Fatal blockquote bug investigated. Implemented workaround to vscode bug, which has finally gone with vscode 1.26.0 .

###  [0.4.6] on January 05, 2018
* Escaped underscore bug removed.

###  [0.4.5] on November 06, 2017
* Backslash bug removed.

###  [0.4.4] on September 27, 2017
* Modifying the `block` mode regular expression with `gitlab` delimiters, so removing the `newline` bug.

## License

`markdown-it-texmath` is licensed under the [MIT License](./license.txt)

 © [Stefan Gössner](https://github.com/goessner)
