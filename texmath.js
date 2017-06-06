'use strict';

const rules = {
    inline: [ 
        {   name: 'math_inline',   // even accept inline $$...$$ formulas ... no, don't !!! (deprecated)
            rex: /\$(\S[^$\r\n]*?[^\s\\]{1}?)\$/gy,
            tmpl: '<eq>$1</eq>',
            tag: '$'
        },
        {   name: 'math_single',
            rex: /\$([^$\s\\]{1}?)\$/gy,
            tmpl: '<eq>$1</eq>',
            tag: '$'
        }
    ],
    block: [ 
        {   name: 'math_block_eqno',
            rex: /\${2}([^$]*?)\${2}\s*?\(([^)$\r\n]+?)\)/gmy,
            tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
            tag: '$$'
        },
        {   name: 'math_block',
            rex: /\${2}([^$]*?)\${2}/gmy,
            tmpl: '<section><eqn>$1</eqn></section>',
            tag: '$$'
        }
    ]
};

function texmath(md, options) {
//    let inlineDelimiter = texmath.delimiters[options && options.delimiter && options.delimiter.inline] || texmath.delimiters['$'],
//        blockDelimiter = texmath.delimiters[options && options.delimiter && options.delimiter.block] || texmath.delimiters['$$'];
    for (let rule of rules.inline) {
        md.inline.ruler.push(rule.name, texmath.inline(rule));
//        md.inline.ruler.before('backticks', rule.name, texmath.inline(rule));
        md.renderer.rules[rule.name] = (tokens, idx) => rule.tmpl.replace(/\$1/,texmath.render(tokens[idx].content,false));
    }

    for (let rule of rules.block) {
        md.block.ruler.before('blockquote', rule.name, texmath.block(rule));
        md.renderer.rules[rule.name] = (tokens, idx) => rule.tmpl.replace(/\$2/,tokens[idx].info)  // equation number .. ?
                                                                 .replace(/\$1/,texmath.render(tokens[idx].content,true));
    }
}

texmath.searchInlineMath = function(state, rule) {
    let found = state.src.indexOf(rule.tag, state.pos) === state.pos, // => state.src.startsWith(rule.tag)
        match;
    if (found) {
       rule.rex.lastIndex = state.pos;
       match = rule.rex.exec(state.src);
       match = match && { match: match[1], from: match.index, to: rule.rex.lastIndex } || false;
       rule.rex.lastIndex = 0;
    }
    return match;
}

texmath.searchBlockMath = function(state, rule, begLine) {
    let begpos = state.bMarks[begLine] + state.tShift[begLine],
        res = state.src.startsWith(rule.tag,begpos) ? rule.rex.exec(state.src.slice(begpos)) : false;

    if (res) {
        let endpos = res ? begpos + rule.rex.lastIndex - 1 : begpos, 
            li, nl = state.bMarks.length;

        for (li=0; li < nl; li++)
            if (endpos >= state.bMarks[li] && endpos <= state.eMarks[li]) // line for end of block math found ...
                break;

        rule.rex.lastIndex = 0;
//    console.log('found blockMath in: '+state.src)
        return { match: res[1], eqno:res[2], from: begpos, to: endpos, line: li+1 };  // line: continue at line after block math
    }
    return false;
}

// texmath.inline = (rule) => dollar;

texmath.inline = (rule) => 
    function(state, silent) {
        let res = texmath.searchInlineMath(state, rule);
        if (res) {
            if (!silent) {
                let token = state.push(rule.name, 'math', 0);
                token.content = res.match;
                token.markup = '$';
//        console.log('found inlineMath ' + token.content + ' in: '+state.src)
            }
            state.pos = res.to;
        }
        return !!res;
    }

texmath.block = (rule) => 
    function(state, begLine, endLine, silent) {
        let res = texmath.searchBlockMath(state, rule, begLine);
        if (res) {
            if (!silent) {
                let token = state.push(rule.name, 'math', 0);
                token.block = true;
                token.content = res.match;
                token.info = res.eqno;
                token.markup = '$$';
            }
            state.line = res.line;
            state.pos = res.to;
        }
        return !!res;
    }

texmath.render = function(tex,isblock) {
    let res;
    try {
        // don't forget to escape '_','*', and '\' .. after math rendering
        res = texmath.katex.renderToString(tex,{throwOnError:false,displayMode:isblock}).replace(/([_\*\\])/g, "\\$1");
    }
    catch(err) {
        res = tex+": "+err.message.replace("<","&lt;");
    }
    return res;
}

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

if (typeof module === "object" && module.exports)
   module.exports = texmath;