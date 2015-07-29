var htmlParser = require('./lib/htmlparser').HTMLParser
var CleanCSS = require('clean-css')
var UglifyJS = require("uglify-js")

var cssmin = function(inlineCSS) {
  var rst = ''
  rst = new CleanCSS().minify(inlineCSS);
  rst = rst.replace(/;$/, '')
  return rst
}

var jsmin = function(inlineJS) {
  var rst = ''
  rst = UglifyJS.minify(inlineJS, {
    fromString: true,
    output: {
      'inline_script': true
    }
  }).code
  rst = rst.replace(/;$/, '')
  return rst
}

var minOnAttrJS = function(js) {
  var code = 'function _htmlmin_temp(){' + js + '}'
  code = jsmin(code)
  code = code.replace(/function _htmlmin_temp\(\)\{/, '')
  code = code.replace(/\}$/, '')
  return code
}

var defaultOptions = {
  html5: true,
  jsmin: true,
  cssmin: true,
  caseSensitive: true,
  removeComments: true,
  removeIgnored: false,
  removeOptionalTags: false,
  collapseWhitespace: false
}

var htmlmin = function(str, options) {
  var rst = []
  var noEndSlashTags = ['br', 'input', 'img', 'area', 'col']
  var optionalTags = ['option', 'th', 'td', 'tr', 'thead', 'tbody', 'tfoot', 'head', 'body', 'html']
  var noValAttrs = ['disabled', 'async', 'checked', 'readonly', 'selected', 'autofocus', 'required', 'multiple']
  var noTrimTags = ['pre', 'textarea', 'code']
  var cannotEmptyAttrs = ['value', 'title', 'src', 'alt', 'href', 'ng-view']
  var lastTag
  var lastIsIgnore

  options = options || {}

  for (var key in defaultOptions) {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key]
    }
  }

  var handlers = {
    html5: options.html5,
    doctype: function(doctype) {
      rst.push(doctype.replace(/[\n\s\r\t]+/g, ' '))
    },
    start: function(tag, attrs, unary) {
      rst.push('<' + (options.caseSensitive ? tag : tag.toLowerCase()))
      attrs.forEach(function(v, i) {
        //script type removeing
        if (tag.toLowerCase() == 'script' && v.name.toLowerCase() == 'type' && v.value.toLowerCase().trim() == 'text/javascript') {
          return false
        }

        if (tag.toLowerCase() == 'input' && v.name.toLowerCase() == 'type' && v.value.toLowerCase().trim() == 'text') {
          return false
        }

        if (tag.toLowerCase() == 'form' && v.name.toLowerCase() == 'method' && v.value.toLowerCase().trim() == 'get') {
          return false
        }

        if (tag.toLowerCase() == 'script' && v.name.toLowerCase() == 'language' && v.value.toLowerCase().trim() == 'javascript') {
          return false
        }

        if (tag.toLowerCase() == 'style' && v.name.toLowerCase() == 'type' && v.value.toLowerCase().trim() == 'text/css') {
          return false
        }

        if (tag.toLowerCase() == 'area' && v.name.toLowerCase() == 'shape' && v.value.toLowerCase().trim() == 'rect') {
          return false
        }

        if ((cannotEmptyAttrs.indexOf(v.name.toLowerCase()) == -1) && v.value !== undefined && v.value.trim() === '') {
          return false
        }

        rst.push(' ' + (options.caseSensitive ? v.name : v.name.toLowerCase()))

        var val

        if (v.value !== undefined) {
          if (v.name === 'style') {
            val = cssmin(v.value)
          }

          if (/^on(.)+/i.test(v.name)) {
            if (v.value.trim().toLowerCase().indexOf('javascript:') === 0) {
              v.value = v.value.replace(/\s*javascript:/i, '').trim()
            }

            val = minOnAttrJS(v.value)

            if (!val) {
              val = v.value
            }
          }

          if (v.name == 'class') {
            v.escaped = v.escaped.replace(/[\n\s\t\r]+/g, ' ')
          }

          if (noValAttrs.indexOf(v.name.toLowerCase()) < 0) {
            if (v.name == 'title' || v.name == 'value') {
              rst.push('="' + (val ? val : v.escaped) + '"')
            } else {
              rst.push('="' + (val ? val : v.escaped.trim()) + '"')
            }
          }
        }
      })

      if (unary && (noEndSlashTags.indexOf(tag.toLowerCase()) < 0)) {
        rst.push(' /')
        lastTag = undefined
      } else {
        lastTag = tag
      }

      if (options.removeOptionalTags && optionalTags.indexOf(tag) > -1) {
        lastTag = undefined
      }

      if (noEndSlashTags.indexOf(tag.toLowerCase()) > -1) {
        lastTag = undefined
      }

      rst.push('>')
      lastIsIgnore = false
    },

    end: function(tag) {
      if ((optionalTags.indexOf(tag) > -1) && options.removeOptionalTags) {
        lastIsIgnore = false
        return false
      }

      if (lastTag !== 'source') {
        rst.push('</' + (options.caseSensitive ? tag : tag.toLowerCase()) + '>')
      }

      lastTag = undefined
      lastIsIgnore = false
    },

    chars: function(text) {
      //textarea ignore
      if (noTrimTags.indexOf(lastTag) > -1) {
        rst.push(text)
        return false
      }

      //console.log(lastIsIgnore, text.match(/^[\n\s\t\r]+/))

      if (!lastIsIgnore) {
        text = text.replace(/^[\n\s\t\r]+$/, '')
      }

      if (options.collapseWhitespace) {
        //left trim
        if (lastTag) {
          text = text.replace(/^[\n\s\t\r]+/im, '')
        }

        if (lastTag !== 'p' && lastTag) {
          text = text.replace(/[\n\s\t\r]+$/im, '')
        }

        //text = text.trim()

        if (lastTag !== 'script' && lastTag !== 'style') {
          text = text.replace(/[\n\t\s\r]+/g, ' ')
        }
      }

      if (lastTag === 'style' && options.cssmin) {
        text = cssmin(text)
      }

      if (lastTag === 'script' && options.jsmin) {
        if (/<!--\s+(.)+\s+-->/.test(text)) {
          text = text;
        } else {
          text = jsmin(text)
        }
      }

      rst.push(text)
        //console.log(rst)
      lastIsIgnore = false
    },

    comment: function(text) {
      if (!options.removeComments || text.indexOf('!') === 0) {
        rst.push('<!--' + text + '-->');
      }

      //IE conditional comment
      var conditionalReg = /^\[[^\]]+\](>)?|(<!)?\[[^\]]+\]$/mg
      if (conditionalReg.test(text)) {
        var comments = text.match(conditionalReg);
        text = htmlmin(text.replace(conditionalReg, ''))
        rst.push('<!--' + comments[0] + text + comments[1] + '-->');
      }

      lastIsIgnore = false
    },

    ignore: function(text) {
      lastIsIgnore = true
      if (!options.removeIgnored) {
        rst.push(text);
      } else {
        lastIsIgnore = false
        lastTag = 'ignore'
      }
    }
  }

  htmlParser(str, handlers)
  return rst.join('')
}

exports = module.exports = htmlmin;
