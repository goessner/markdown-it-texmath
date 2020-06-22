/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2017-20. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

function texmath(md, options) {
    const delimiters = options && options.delimiters || 'dollars';
    const katexOptions = options && options.katexOptions || { throwOnError: false };
    katexOptions.macros = options && options.macros || katexOptions.macros;  // ensure backwards compatibility

    if (!texmath.katex) { // else ... depricated `use` method was used ...
        if (options && typeof options.engine === 'object') {
            texmath.katex = options.engine;
        }
        else if (typeof module === "object")
            texmath.katex = require('katex');
        else  // artifical error object.
            texmath.katex = { renderToString() { return 'No math renderer found.' }};
    }

    if (delimiters in texmath.rules) {
        for (const rule of texmath.rules[delimiters].inline) {
            md.inline.ruler.before('escape', rule.name, texmath.inline(rule));  // ! important
            md.renderer.rules[rule.name] = (tokens, idx) => rule.tmpl.replace(/\$1/,texmath.render(tokens[idx].content,!!rule.displayMode,katexOptions));
        }

        for (const rule of texmath.rules[delimiters].block) {
            md.block.ruler.before('fence', rule.name, texmath.block(rule));
            md.renderer.rules[rule.name] = (tokens, idx) => rule.tmpl.replace(/\$2/,tokens[idx].info)  // equation number .. ?
                                                                     .replace(/\$1/,texmath.render(tokens[idx].content,true,katexOptions));
        }
    }
}

// texmath.inline = (rule) => dollar;  // just for testing ..

texmath.inline = (rule) => 
    function(state, silent) {
        const pos = state.pos;
        const str = state.src;
        const pre = str.startsWith(rule.tag, rule.rex.lastIndex = pos) && (!rule.pre || rule.pre(str, pos));  // valid pre-condition ...
        const match = pre && rule.rex.exec(str);
        const lastPos = match && (rule.rex.lastIndex - 1);

        if (match && (!rule.post || rule.post(str, lastPos))) {   // match && valid post-condition
            if (!silent) {
                const token = state.push(rule.name, 'math', 0);
                token.content = match[1];
                token.markup = rule.tag;
            }
            state.pos = rule.rex.lastIndex;
        }
        rule.rex.lastIndex = 0;
        return !!match;
    }

texmath.block = (rule) => 
    function block(state, begLine, endLine, silent) {
        texmath.inBlockquote(state.tokens);  // cache current blockquote level ...

        const pos = state.bMarks[begLine] + state.tShift[begLine];
        const str = state.src;
        const pre = str.startsWith(rule.tag, rule.rex.lastIndex = pos) && (!rule.pre || rule.pre(str, pos));  // valid pre-condition ....
        const match = pre && rule.rex.exec(str);
        const lastPos = match && (rule.rex.lastIndex - 1);

        if (match && (!rule.post || rule.post(str, lastPos))) {    // match and valid post-condition ...
            if (match[1].includes('\n') && texmath.inBlockquote.level) // multiline display math inside of blockquote block.
                match[1] = match[1].replace(/(^(?:\s*>)+)/gm,'\n');  // so remove all leading '>' inside of display math !
            if (!silent) {
                const token = state.push(rule.name, 'math', 0);
                token.block = true;
                token.content = match[1];
                token.info = match[match.length-1];
                token.markup = rule.tag;
            }
            for (let line=begLine, endpos=lastPos; line < endLine; line++)
                if (endpos >= state.bMarks[line] && endpos <= state.eMarks[line]) { // line for end of block math found ...
                    state.line = line+1;
                    break;
                }
        }
        rule.rex.lastIndex = 0;
        return !!match;
    }

texmath.inBlockquote = function(tokens) {
    if (tokens && tokens.length) {
        const len = tokens.length;
        texmath.inBlockquote.level = tokens[len-1].type === 'blockquote_open'  ? tokens[len-1].level + 1
                                   : tokens[len-1].type === 'blockquote_close' ? tokens[len-1].level
                                   : texmath.inBlockquote.level;
    }
    else
        texmath.inBlockquote.level = 0;
}
texmath.inBlockquote.level = 0;

texmath.render = function(tex,displayMode,options) {
    options.displayMode = displayMode;
    let res;
    try {
        res = texmath.katex.renderToString(tex, options);
    }
    catch(err) {
        res = tex+": "+err.message.replace("<","&lt;");
    }
    return res;
}

// ! deprecated ... use options !
texmath.use = function(katex) {  // math renderer used ...
    texmath.katex = katex;       // ... katex solely at current ...
    return texmath;
}

/*
function dollar(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x24) { return false; }  // $

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x24) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('$', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x24) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('math_inline', 'math', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
                                 .replace(/[ \n]+/g, ' ')
                                 .trim();
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};
*/

texmath.$_pre = (str,beg) => {
    const prv = beg > 0 ? str[beg-1].charCodeAt(0) : false;
    return !prv || prv !== 0x5c                // no backslash,
                && (prv < 0x30 || prv > 0x39); // no decimal digit .. before opening '$'
}
texmath.$_post = (str,end) => {
    const nxt = str[end+1] && str[end+1].charCodeAt(0);
    return !nxt || nxt < 0x30 || nxt > 0x39;   // no decimal digit .. after closing '$'
}

texmath.rules = {
    brackets: {
        inline: [ 
            {   name: 'math_inline',
                rex: /\\\((.+?)\\\)/gy,
                tmpl: '<eq>$1</eq>',
                tag: '\\('
            }
        ],
        block: [
            {   name: 'math_block_eqno',
                rex: /\\\[(((?!\\\]|\\\[)[\s\S])+?)\\\]\s*?\(([^)$\r\n]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '\\['
            },
            {   name: 'math_block',
                rex: /\\\[([\s\S]+?)\\\]/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '\\['
            }
        ]
    },
    gitlab: {
        inline: [ 
            {   name: 'math_inline',
                rex: /\$`(.+?)`\$/gy,
                tmpl: '<eq>$1</eq>',
                tag: '$`'
            }
        ],
        block: [ 
            {   name: 'math_block_eqno',
                rex: /`{3}math\s*?([^`]+?)\s*?`{3}\s*?\(([^)$\r\n]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '```math'
            },
            {   name: 'math_block',
                rex: /`{3}math\s*?([^`]*?)\s*?`{3}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '```math'
            }
        ]
    },
    julia: {
        inline: [ 
            {   name: 'math_inline', 
                rex: /`{2}([^`]+?)`{2}/gy,
                tmpl: '<eq>$1</eq>',
                tag: '``'
            },
            {   name: 'math_inline',
                rex: /\$((?:\S?)|(?:\S.*?\S))\$/gy,
                tmpl: '<eq>$1</eq>',
                tag: '$',
                pre: texmath.$_pre,
                post: texmath.$_post
            }
        ],
        block: [
            {   name: 'math_block_eqno',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}\s*?\(([^)$\r\n]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '```math'
            },
            {   name: 'math_block',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '```math'
            }
        ]
    },
    kramdown: {
        inline: [ 
            {   name: 'math_inline', 
                rex: /\${2}(.+?)\${2}/gy,
                tmpl: '<eq>$1</eq>',
                tag: '$$'
            }
        ],
        block: [
            {   name: 'math_block_eqno',
                rex: /\${2}([^$]+?)\${2}\s*?\(([^)\s]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '$$'
            },
            {   name: 'math_block',
                rex: /\${2}([^$]+?)\${2}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '$$'
            }
        ]
    },
    dollars: {
        inline: [
            {   name: 'math_inline_double',
                rex: /\${2}((?:\S)|(?:\S.*?\S))\${2}/gy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '$$',
                displayMode: true,
                pre: texmath.$_pre,
                post: texmath.$_post
            },
            {   name: 'math_inline',
                rex: /\$((?:\S)|(?:\S.*?\S))\$/gy,
                tmpl: '<eq>$1</eq>',
                tag: '$',
                pre: texmath.$_pre,
                post: texmath.$_post
            }
        ],
        block: [
            {   name: 'math_block_eqno',
                rex: /\${2}([^$]+?)\${2}\s*?\(([^)\s]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '$$'
            },
            {   name: 'math_block',
                rex: /\${2}([^$]+?)\${2}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '$$'
            }
        ]
    }
};

if (typeof module === "object" && module.exports)
   module.exports = texmath;