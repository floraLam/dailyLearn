## Description

A simple html minifier.

idea and html parser from [https://github.com/kangax/html-minifier](https://github.com/kangax/html-minifier)

## Installation

```bash
npm -g install htmlmin
```

## Test

```bash
npm -g install mocha
mocha
```

## Usage

The module exports the htmlmin function, so you can use it with : 

```javascript
var htmlmin = require('htmlmin');
```

The function htmlmin takes two arguments :

* input : the html content you want to minimize.
* options : minimize options.

### options

* cssmin: true, minifier inline css
* jsmin: true, minifier inline javascript
* caseSensitive: true 
* removeComments: true, remove comment, if you want keep comment, give a '!' at the beigin of your comment
* removeIgnored: false, remove tags not recognize
* removeOptionalTags: false, some tag can without end tag, remove these end tags 
* collapseWhitespace: false, 

Example :

```javascript
var htmlmin = require('htmlmin');
var html = '<script type=\"text\/javascript\">var abc= \"hello\";<\/script>\r\n\r\n\r\n' +
            '<style type=\"text\/css\">#foo { color: red;        }          <\/style>\r\n\r\n\r\n' +
            '<div>\r\n  <div>\r\n    <div><!-- hello -->\r\n      <div>' +
            '<!--! hello -->\r\n        <div>\r\n          <div class=\"\">\r\n\r\n            ' +
            '<textarea disabled=\"disabled\">     this is a textarea <\/textarea>\r\n          ' +
            '<\/div>\r\n        <\/div>\r\n      <\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>' +
            '<pre>       \r\nxxxx<\/pre><span>x<\/span> <span>Hello<\/span> <b>billy<\/b>     \r\n' +
            '<input type=\"text\">\r\n<textarea><\/textarea>\r\n<pre><\/pre>';

console.log(htmlmin(html))
```

this will output :

```
<script>var abc="hello"</script><style>#foo{color:red}</style><div><div><div><div><!--! hello --><div><div><textarea disabled>     this is a textarea </textarea></div></div></div></div></div></div><pre>       
xxxx</pre><span>x</span><span>Hello</span><b>billy</b><input><textarea></textarea><pre></pre></b></span>
</pre></div></style></script>
```

## License

MIT
