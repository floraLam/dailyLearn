var htmlmin = require('../')
var assert = require('assert')
var input
var output

describe('htmlmin', function() {

    it('parsing non-trivial markup', function() {
        assert.equal(htmlmin('<p title="</p>">x</p>'), '<p title="</p>">x</p>');
        assert.equal(htmlmin('<p title=" <!-- hello world --> ">x</p>'), '<p title=" <!-- hello world --> ">x</p>');
        assert.equal(htmlmin('<p title=" <![CDATA[ \n\n foobar baz ]]> ">x</p>'), '<p title=" <![CDATA[ \n\n foobar baz ]]> ">x</p>');
        assert.equal(htmlmin('<p foo-bar=baz>xxx</p>'), '<p foo-bar="baz">xxx</p>');
        assert.equal(htmlmin('<p foo:bar=baz>xxx</p>'), '<p foo:bar="baz">xxx</p>');

        input = '<div><div><div><div><div><div><div><div><div><div>' +
            'i\'m 10 levels deep' +
            '</div></div></div></div></div></div></div></div></div></div>';

        assert.equal(htmlmin(input), input);

        assert.equal(htmlmin("<script>alert(\"<!--\")<\/script>"), "<script>alert(\"<!--\")<\/script>");
        assert.equal(htmlmin("<script>alert(\"<!-- foo -->\")<\/script>"), "<script>alert(\"<!-- foo -->\")<\/script>");
        assert.equal(htmlmin("<script>alert(\"-->\")<\/script>"), "<script>alert(\"-->\")<\/script>");

        assert.equal(htmlmin('<a title="x"href=" ">foo</a>'), '<a title="x" href="">foo</a>');
        assert.equal(htmlmin('<p id=""class=""title="">x'), '<p title="">x</p>');
        assert.equal(htmlmin('<p x="x\'"">x</p>'), '<p x="x\'">x</p>', 'trailing quote should be ignored');
        assert.equal(htmlmin('<a href="#"><p>Click me</p></a>'), '<a href="#"><p>Click me</p></a>');
        assert.equal(htmlmin('<span><button>Hit me</button></span>'), '<span><button>Hit me</button></span>');
        assert.equal(htmlmin('<object type="image/svg+xml" data="image.svg"><div>[fallback image]</div></object>'),
            '<object type="image/svg+xml" data="image.svg"><div>[fallback image]</div></object>'
        );

        assert.equal(htmlmin('<ng-include src="x"></ng-include>'), '<ng-include src="x"></ng-include>');
        assert.equal(htmlmin('<ng:include src="x"></ng:include>'), '<ng:include src="x"></ng:include>');
        assert.equal(htmlmin('<ng-include src="\'views/partial-notification.html\'"></ng-include><div ng-view=""></div>'),
            '<ng-include src="\'views/partial-notification.html\'"></ng-include><div ng-view=""></div>'
        );

        // https://github.com/kangax/html-minifier/issues/41
        assert.equal(htmlmin('<some-tag-1></some-tag-1><some-tag-2></some-tag-2>'),
            '<some-tag-1></some-tag-1><some-tag-2></some-tag-2>'
        );

        // https://github.com/kangax/html-minifier/issues/40
        assert.equal(htmlmin('[\']["]'), '[\']["]');

        // https://github.com/kangax/html-minifier/issues/21
        assert.equal(htmlmin('<a href="test.html"><div>hey</div></a>'), '<a href="test.html"><div>hey</div></a>');

        // https://github.com/kangax/html-minifier/issues/17
        assert.equal(htmlmin(':) <a href="http://example.com">link</a>'), ':) <a href="http://example.com">link</a>');
    });

    it('`minifiy` exists', function() {
        assert.ok(htmlmin);
    });

    it('options', function() {
        input = '<p>blah<span>blah 2<span>blah 3</span></span></p>';
        assert.equal(htmlmin(input), input);
        assert.equal(htmlmin(input, {}), input);
    });

    it('case normalization', function() {
        assert.equal(htmlmin('<P>foo</p>', {
            caseSensitive: false
        }), '<p>foo</p>');
        assert.equal(htmlmin('<DIV>boo</DIV>', {
            caseSensitive: false
        }), '<div>boo</div>');
        assert.equal(htmlmin('<DIV title="moo">boo</DiV>', {
            caseSensitive: false
        }), '<div title="moo">boo</div>');
        assert.equal(htmlmin('<DIV TITLE="blah">boo</DIV>', {
            caseSensitive: false
        }), '<div title="blah">boo</div>');
        assert.equal(htmlmin('<DIV tItLe="blah">boo</DIV>', {
            caseSensitive: false
        }), '<div title="blah">boo</div>');
        assert.equal(htmlmin('<DiV tItLe="blah">boo</DIV>', {
            caseSensitive: false
        }), '<div title="blah">boo</div>');
    });

    it('space normalization between attributes', function() {
        assert.equal(htmlmin('<p title="bar">foo</p>'), '<p title="bar">foo</p>');
        assert.equal(htmlmin('<img src="test"/>'), '<img src="test">');
        assert.equal(htmlmin('<p title = "bar">foo</p>'), '<p title="bar">foo</p>');
        assert.equal(htmlmin('<p title\n\n\t  =\n     "bar">foo</p>'), '<p title="bar">foo</p>');
        assert.equal(htmlmin('<img src="test" \n\t />'), '<img src="test">');
        assert.equal(htmlmin('<input title="bar"       id="boo"    value="hello world">'), '<input title="bar" id="boo" value="hello world">');
    });

    it('space normalization around text', function() {
        assert.equal(htmlmin('   <p>blah</p>\n\n\n   '), '<p>blah</p>');
        // tags from collapseWhitespaceSmart()
        ['a', 'b', 'big', 'button', 'em', 'font', 'i', 'kbd', 'mark', 'q', 's', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'time', 'tt', 'u'].forEach(function(el) {
            assert.equal(htmlmin('<p>foo <' + el + '>baz</' + el + '> bar</p>', {
                collapseWhitespace: true
            }), '<p>foo <' + el + '>baz</' + el + '> bar</p>');

            assert.equal(htmlmin('<p>foo<' + el + '>baz</' + el + '>bar</p>', {
                collapseWhitespace: true
            }), '<p>foo<' + el + '>baz</' + el + '>bar</p>');
            assert.equal(htmlmin('<p>foo <' + el + '>baz</' + el + '>bar</p>', {
                collapseWhitespace: true
            }), '<p>foo <' + el + '>baz</' + el + '>bar</p>');
            assert.equal(htmlmin('<p>foo<' + el + '>baz</' + el + '> bar</p>', {
                collapseWhitespace: true
            }), '<p>foo<' + el + '>baz</' + el + '> bar</p>');
            assert.equal(htmlmin('<p>foo <' + el + '> baz </' + el + '> bar</p>', {
                collapseWhitespace: true
            }), '<p>foo <' + el + '>baz</' + el + '> bar</p>');
            assert.equal(htmlmin('<p>foo<' + el + '> baz </' + el + '>bar</p>', {
                collapseWhitespace: true
            }), '<p>foo<' + el + '>baz</' + el + '>bar</p>');
            assert.equal(htmlmin('<p>foo <' + el + '> baz </' + el + '>bar</p>', {
                collapseWhitespace: true
            }), '<p>foo <' + el + '>baz</' + el + '>bar</p>');
            assert.equal(htmlmin('<p>foo<' + el + '> baz </' + el + '> bar</p>', {
                collapseWhitespace: true
            }), '<p>foo<' + el + '>baz</' + el + '> bar</p>');
        });
        assert.equal(htmlmin('<p>foo <img> bar</p>', {
            collapseWhitespace: true
        }), '<p>foo <img> bar</p>');
        assert.equal(htmlmin('<p>foo<img>bar</p>', {
            collapseWhitespace: true
        }), '<p>foo<img>bar</p>');
        assert.equal(htmlmin('<p>foo <img>bar</p>', {
            collapseWhitespace: true
        }), '<p>foo <img>bar</p>');
        assert.equal(htmlmin('<p>foo<img> bar</p>', {
            collapseWhitespace: true
        }), '<p>foo<img> bar</p>');
    });

    it('doctype normalization', function() {
        input = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n    "http://www.w3.org/TR/html4/strict.dtd">';
        output = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
        assert.equal(htmlmin(input, {
            useShortDoctype: true
        }), output);

        input = '<!DOCTYPE html>';
        assert.equal(htmlmin(input, {
            useShortDoctype: true
        }), input);

        input = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
        assert.equal(htmlmin(input, {
            useShortDoctype: false
        }), input);
    });

    it('removing comments', function() {
        input = '<!-- test -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), '');

        input = '<!-- foo --><div>baz</div><!-- bar\n\n moo -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), '<div>baz</div>');
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        input = '<p title="<!-- comment in attribute -->">foo</p>';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);

        input = '<script><!-- alert(1) --><\/script>';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);

        input = '<STYLE><!-- alert(1) --><\/STYLE>';
        assert.equal(htmlmin(input, {
            removeComments: true,
            caseSensitive:false
        }), '<style><!-- alert(1) --><\/style>');
    });

    it('ignoring comments', function() {
        input = '<!--! test -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        input = '<!--! foo --><div>baz</div><!--! bar\n\n moo -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        input = '<!--! foo --><div>baz</div><!-- bar\n\n moo -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), '<!--! foo --><div>baz</div>');
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        input = '<!-- ! test -->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), '');
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        input = '<div>\n\n   \t<div><div>\n\n<p>\n\n<!--!      \t\n\nbar\n\n moo         -->      \n\n</p>\n\n        </div>  </div></div>';
        output = '<div><div><div><p><!--!      \t\n\nbar\n\n moo         --></p></div></div></div>';
        assert.equal(htmlmin(input), output);

        input = '<p rel="<!-- comment in attribute -->" title="<!--! ignored comment in attribute -->">foo</p>';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);
    });

    it('conditional comments', function() {
        input = '<!--[if IE 6]>test<![endif]-->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);

        input = '<!--[if lt IE 5.5]>test<![endif]-->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);

        input = '<!--[if (gt IE 5)&(lt IE 7)]>test<![endif]-->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), input);
    });

    it('collapsing space in conditional comments', function() {
        input = '<!--[if IE 7]>\n\n   \t\n   \t\t ' +
            '<link rel="stylesheet" href="/css/ie7-fixes.css" type="text/css" />\n\t' +
            '<![endif]-->';
        output = '<!--[if IE 7]>' +
            '<link rel="stylesheet" href="/css/ie7-fixes.css" type="text/css" />' +
            '<![endif]-->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), output);

        input = '<!--[if lte IE 6]>\n    \n   \n\n\n\t' +
            '<p title=" sigificant     whitespace   ">blah blah</p>' +
            '<![endif]-->';
        output = '<!--[if lte IE 6]>' +
            '<p title=" sigificant     whitespace   ">blah blah</p>' +
            '<![endif]-->';
        assert.equal(htmlmin(input, {
            removeComments: true
        }), output);
    });

    it('remove comments from scripts', function() {
        input = '<script><!--alert(1)--><\/script>';
        output = '<script><\/script>';
        assert.equal(htmlmin(input, {
            removeCommentsFromCDATA: true
        }), output);

        input = '<script><!--alert(1)<\/script>';
        output = '<script><\/script>';
        assert.equal(htmlmin(input, {
            removeCommentsFromCDATA: true
        }), output);

        //TODO
        //input = '<script type="text/javascript"> <!--\nalert("-->"); -->\n\n   <\/script>';
        //output = '<script type="text/javascript">alert("-->");<\/script>';
        //assert.equal(htmlmin(input, {
        //    removeCommentsFromCDATA: true
        //}), output);

        //input = '<script> //   <!--   \n  alert(1)   //  --> <\/script>';
        //output = '<script>  alert(1)<\/script>';
        //assert.equal(htmlmin(input, {
        //    removeCommentsFromCDATA: true
        //}), output);
    });

    it('remove comments from styles', function() {
        input = '<style type="text/css"><!-- p { color: red } --><\/style>';
        output = '<style><!-- p{color:red}--><\/style>';
        assert.equal(htmlmin(input, {
            removeCommentsFromCDATA: true
        }), output);

        input = '<style type="text/css">p::before { content: "<!--" }<\/style>';
        output = '<style>p::before{content:"<!--"}<\/style>';
        assert.equal(htmlmin(input, {
            removeCommentsFromCDATA: true
        }), output);
    });

    it('remove CDATA sections from scripts/styles', function() {
        input = '<script>/*<![CDATA[*/alert(1)/*]]>*/<\/script>';
        output = '<script>alert(1)<\/script>';
        assert.equal(htmlmin(input, {
            removeCDATASectionsFromCDATA: true
        }), output);

        input = '<script>//<![CDATA[\nalert(1)\n//]]><\/script>';
        output = '<script>alert(1)<\/script>';
        assert.equal(htmlmin(input, {
            removeCDATASectionsFromCDATA: true
        }), output);

        input = '<script type="text/javascript"> /* \n\t  <![CDATA[  */ alert(1) /*  ]]>  */ \n <\/script>';
        output = '<script>alert(1)<\/script>';
        assert.equal(htmlmin(input, {
            removeCDATASectionsFromCDATA: true
        }), output);

        //TODO
        //input = '<style>/* <![CDATA[ */p { color: red } // ]]><\/style>';
        //output = '<style>p { color: red } <\/style>';
        //assert.equal(htmlmin(input, {
        //    removeCDATASectionsFromCDATA: true
        //}), output);

        input = '<script>\n\n//<![CDATA[\nalert(1)//]]><\/script>';
        output = '<script>alert(1)<\/script>';
        assert.equal(htmlmin(input, {
            removeCDATASectionsFromCDATA: true
        }), output);

    });

    it('empty attributes', function() {
        input = '<p id="" class="" STYLE=" " title="\n" lang="" dir="">x</p>';
        assert.equal(htmlmin(input, {
            removeEmptyAttributes: true
        }), '<p title="\n">x</p>');

        input = '<p onclick=""   ondblclick=" " onmousedown="" ONMOUSEUP="" onmouseover=" " onmousemove="" onmouseout="" ' +
            'onkeypress=\n\n  "\n     " onkeydown=\n"" onkeyup\n="">x</p>';
        assert.equal(htmlmin(input, {
            removeEmptyAttributes: true
        }), '<p>x</p>');

        input = '<input onfocus="" onblur="" onchange=" " value=" boo ">';
        assert.equal(htmlmin(input, {
            removeEmptyAttributes: true
        }), '<input value=" boo ">');

        //TODO
        //input = '<input value="" name="foo">';
        //assert.equal(htmlmin(input, {
        //    removeEmptyAttributes: true
        //}), '<input name="foo">');

        input = '<img src="" alt="">';
        assert.equal(htmlmin(input, {
            removeEmptyAttributes: true
        }), '<img src="" alt="">');
    });

    it('cleaning class/style attributes', function() {
        input = '<p class=" foo bar  ">foo bar baz</p>', output;
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), '<p class="foo bar">foo bar baz</p>');

        input = '<p class=" foo      ">foo bar baz</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), '<p class="foo">foo bar baz</p>');

        input = '<p class="\n  \n foo   \n\n\t  \t\n   ">foo bar baz</p>';
        output = '<p class="foo">foo bar baz</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<p class="\n  \n foo   \n\n\t  \t\n  class1 class-23 ">foo bar baz</p>';
        output = '<p class="foo class1 class-23">foo bar baz</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<p style="    color: red; background-color: rgb(100, 75, 200);  "></p>';
        output = '<p style="color:red;background-color:#644bc8"></p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<p style="font-weight: bold  ; "></p>';
        output = '<p style="font-weight:700"></p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);
    });

    it('cleaning URI-based attributes', function() {
        input = '<a href="   http://example.com  ">x</a>';
        output = '<a href="http://example.com">x</a>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<a href="  \t\t  \n \t  ">x</a>';
        output = '<a href="">x</a>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<img src="   http://example.com  " title="bleh   " longdesc="  http://example.com/longdesc \n\n   \t ">';
        output = '<img src="http://example.com" title="bleh   " longdesc="http://example.com/longdesc">';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<img src="" usemap="   http://example.com  ">';
        output = '<img src="" usemap="http://example.com">';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<form action="  somePath/someSubPath/someAction?foo=bar&baz=qux     "></form>';
        output = '<form action="somePath/someSubPath/someAction?foo=bar&baz=qux"></form>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<BLOCKQUOTE cite=" \n\n\n http://www.mycom.com/tolkien/twotowers.html     "><P>foobar</P></BLOCKQUOTE>';
        output = '<BLOCKQUOTE cite="http://www.mycom.com/tolkien/twotowers.html"><P>foobar</P></BLOCKQUOTE>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<head profile="       http://gmpg.org/xfn/11    "></head>';
        output = '<head profile="http://gmpg.org/xfn/11"></head>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<object codebase="   http://example.com  "></object>';
        output = '<object codebase="http://example.com"></object>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);
    });

    it('cleaning Number-based attributes', function() {
        input = '<a href="#" tabindex="   1  ">x</a><button tabindex="   2  ">y</button>';
        output = '<a href="#" tabindex="1">x</a><button tabindex="2">y</button>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<input value="" maxlength="     5 ">';
        output = '<input value="" maxlength="5">';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<select size="  10   \t\t "><option>x</option></select>';
        output = '<select size="10"><option>x</option></select>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<textarea rows="   20  " cols="  30      "></textarea>';
        output = '<textarea rows="20" cols="30"></textarea>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<COLGROUP span="   40  "><COL span="  39 "></COLGROUP>';
        output = '<COLGROUP span="40"><COL span="39"></COLGROUP>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<tr><td colspan="    2   ">x</td><td rowspan="   3 "></td></tr>';
        output = '<tr><td colspan="2">x</td><td rowspan="3"></td></tr>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);
    });

    it('cleaning other attributes', function() {
        input = '<a href="#" onclick="  window.prompt(\'boo\'); " onmouseover=" \n\n alert(123)  \t \n\t  ">blah</a>';
        output = '<a href="#" onclick="window.prompt(\"boo\")" onmouseover="alert(123)">blah</a>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);

        input = '<body onload="  foo();   bar() ;  "><p>x</body>';
        output = '<body onload="foo(),bar()"><p>x</p></body>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), output);
    });

    it('removing redundant attributes (&lt;form method="get" ...>)', function() {
        input = '<form method="get">hello world</form>';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<form>hello world</form>');

        input = '<form method="post">hello world</form>';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<form method="post">hello world</form>');
    });

    it('removing redundant attributes (&lt;input type="text" ...>)', function() {
        input = '<input type="text">';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<input>');

        input = '<input type="  TEXT  " value="foo">';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<input value="foo">');

        input = '<input type="checkbox">';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<input type="checkbox">');
    });

    it('removing redundant attributes (&lt;... language="javascript" ...>)', function() {
        input = '<script language="Javascript">x=2,y=4<\/script>';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<script>x=2,y=4<\/script>');

        input = '<script LANGUAGE = "  javaScript  ">x=2,y=4<\/script>';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), '<script>x=2,y=4<\/script>');
    });

    it('removing redundant attributes (&lt;area shape="rect" ...>)', function() {
        input = '<area shape="rect" coords="696,25,958,47" href="#" title="foo">';
        output = '<area coords="696,25,958,47" href="#" title="foo">';
        assert.equal(htmlmin(input, {
            removeRedundantAttributes: true
        }), output);
    });

    it('removing redundant attributes (&lt;... = "javascript: ..." ...>)', function() {
        input = '<p onclick="javascript:alert(1)">x</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), '<p onclick="alert(1)">x</p>');

        input = '<p onclick="javascript:x">x</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), '<p onclick="x">x</p>');

        input = '<p onclick=" JavaScript: x">x</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), '<p onclick="x">x</p>');

        input = '<p title="javascript:(function() { /* some stuff here */ })()">x</p>';
        assert.equal(htmlmin(input, {
            cleanAttributes: true
        }), input);
    });

    it('removing type="text/javascript" attributes', function() {
        input = '<script type="text/javascript">alert(1)<\/script>';
        output = '<script>alert(1)<\/script>';

        assert.equal(htmlmin(input, {
            removeScriptTypeAttributes: true
        }), output);

        input = '<SCRIPT TYPE="  text/javascript ">alert(1)<\/script>';
        output = '<script>alert(1)<\/script>';

        assert.equal(htmlmin(input, {
            caseSensitive: false,
            removeScriptTypeAttributes: true
        }), output);

        input = '<script type="application/javascript;version=1.8">alert(1)<\/script>';
        output = '<script type="application/javascript;version=1.8">alert(1)<\/script>';

        assert.equal(htmlmin(input, {
            removeScriptTypeAttributes: true
        }), output);

        input = '<script type="text/vbscript">MsgBox("foo bar")<\/script>';
        output = '<script type="text/vbscript">MsgBox("foo bar")<\/script>';

        assert.equal(htmlmin(input, {
            removeScriptTypeAttributes: true
        }), output);
    });

    it('removing type="text/css" attributes', function() {
        input = '<style type="text/css">.foo { color: red }<\/style>';
        output = '<style>.foo{color:red}<\/style>';

        assert.equal(htmlmin(input), output);

        input = '<STYLE TYPE = "  text/CSS ">body { font-size: 1.75em }<\/style>';
        output = '<style>body { font-size: 1.75em }<\/style>';

        assert.equal(htmlmin(input, {
            caseSensitive: false
        }), output);

        input = '<style type="text/plain">.foo { background: green }<\/style>';
        output = '<style type="text/plain">.foo{background:green}<\/style>';

        assert.equal(htmlmin(input, {
            removeStyleLinkTypeAttributes: true
        }), output);
    });

    //it('removing attribute quotes', function() {
    //input = '<p title="blah" class="a23B-foo.bar_baz:qux" id="moo">foo</p>';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<p title=blah class=a23B-foo.bar_baz:qux id=moo>foo</p>');

    //input = '<input value="hello world">';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<input value="hello world">');

    //input = '<a href="#" title="foo#bar">x</a>';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<a href=# title=foo#bar>x</a>');

    //input = '<a href="http://example.com/" title="blah">\nfoo\n\n</a>';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<a href="http://example.com/" title=blah>\nfoo\n\n</a>');

    //input = '<a title="blah" href="http://example.com/">\nfoo\n\n</a>';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<a title=blah href="http://example.com/">\nfoo\n\n</a>');

    //input = '<p class=foo|bar:baz></p>';
    //assert.equal(htmlmin(input, {
    //removeAttributeQuotes: true
    //}), '<p class=foo|bar:baz></p>');
    //});

    it('collapsing whitespace', function() {
        input = '<script type="text/javascript">  \n\t   alert(1) \n\n\n  \t <\/script>';
        output = '<script>alert(1)<\/script>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<p>foo</p>    <p> bar</p>\n\n   \n\t\t  <div title="quz">baz  </div>';
        output = '<p>foo</p><p>bar</p><div title="quz">baz</div>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<p> foo    bar</p>';
        output = '<p>foo bar</p>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<p>foo\nbar</p>';
        output = '<p>foo bar</p>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<p> foo    <span>  blah     <i>   22</i>    </span> bar <img src=""></p>';
        output = '<p>foo <span>blah<i>22</i></span> bar <img src=""></p>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<textarea> foo bar     baz \n\n   x \t    y </textarea>';
        output = '<textarea> foo bar     baz \n\n   x \t    y </textarea>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<div><textarea></textarea>    </div>';
        output = '<div><textarea></textarea></div>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<div><pre> $foo = "baz"; </pre>    </div>';
        output = '<div><pre> $foo = "baz"; </pre></div>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<script type=\"text\/javascript\">var abc= \"hello\";<\/script>\r\n\r\n\r\n' +
            '<style type=\"text\/css\">#foo { color: red;        }          <\/style>\r\n\r\n\r\n' +
            '<div>\r\n  <div>\r\n    <div><!-- hello -->\r\n      <div>' +
            '<!--! hello -->\r\n        <div>\r\n          <div class=\"\">\r\n\r\n            ' +
            '<textarea disabled=\"disabled\">     this is a textarea <\/textarea>\r\n          ' +
            '<\/div>\r\n        <\/div>\r\n      <\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>' +
            '<pre>       \r\nxxxx<\/pre><span>x<\/span> <span>Hello<\/span> <b>billy<\/b>     \r\n' +
            '<input type=\"text\">\r\n<textarea><\/textarea>\r\n<pre><\/pre>';
        output = '<script>var abc="hello"</script>' +
            '<style>#foo{color:red}</style>' +
            '<div><div><div>' +
            '<div><!--! hello --><div><div>' +
            '<textarea disabled>     this is a textarea </textarea>' +
            '</div></div></div></div></div></div>' +
            '<pre>       \r\nxxxx</pre><span>x</span><span>Hello</span><b>billy</b>' +
            '<input><textarea></textarea><pre></pre>';
        assert.equal(htmlmin(input, {
            removeComments: true,
            collapseWhitespace: true
        }), output);

        input = '<pre title="some title...">   hello     world </pre>';
        output = '<pre title="some title...">   hello     world </pre>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<pre title="some title..."><code>   hello     world </code></pre>';
        output = '<pre title="some title..."><code>   hello     world </code></pre>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<script>alert("foo     bar")    <\/script>';
        output = '<script>alert("foo     bar")<\/script>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);

        input = '<style>alert("foo     bar")    <\/style>';
        output = '<style>alert("foo     bar")<\/style>';
        assert.equal(htmlmin(input, {
            collapseWhitespace: true
        }), output);
    });

    //  TODO
    //it('removing empty elements', function() {

    //    assert.equal(htmlmin('<p>x</p>', {
    //        removeEmptyElements: true
    //    }), '<p>x</p>');
    //    assert.equal(htmlmin('<p></p>', {
    //        removeEmptyElements: true
    //    }), '');

    //    input = '<p>foo<span>bar</span><span></span></p>';
    //    output = '<p>foo<span>bar</span></p>';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<a href="http://example/com" title="hello world"></a>';
    //    output = '';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<textarea cols="10" rows="10"></textarea>';
    //    output = '<textarea cols="10" rows="10"></textarea>';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<div>hello<span>world</span></div>';
    //    output = '<div>hello<span>world</span></div>';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<p>x<span title="<" class="blah-moo"></span></p>';
    //    output = '<p>x</p>';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<div>x<div>y <div>blah</div><div></div>foo</div>z</div>';
    //    output = '<div>x<div>y <div>blah</div>foo</div>z</div>';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);

    //    input = '<img src="">';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), input);

    //    input = '<p><!-- x --></p>';
    //    output = '';
    //    assert.equal(htmlmin(input, {
    //        removeEmptyElements: true
    //    }), output);
    //});

    it('collapsing boolean attributes', function() {
        input = '<input disabled="disabled">';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<input disabled>');

        input = '<input CHECKED = "checked" readonly="readonly">';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<input CHECKED readonly>');

        input = '<option name="blah" selected="selected">moo</option>';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<option name="blah" selected>moo</option>');

        input = '<input autofocus="autofocus">';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<input autofocus>');

        input = '<input required="required">';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<input required>');

        input = '<input multiple="multiple">';
        assert.equal(htmlmin(input, {
            collapseBooleanAttributes: true
        }), '<input multiple>');
    });

    it('removing optional tags', function() {
        input = '<html><head><title>hello</title></head><body><p>foo<span>bar</span></p></body></html>';
        output = '<html><head><title>hello</title><body><p>foo<span>bar</span></p>';
        assert.equal(htmlmin(input, {
            removeOptionalTags: true
        }), output);
        assert.equal(htmlmin(input), input);
    });

    it('removing optional tags in tables', function() {

        input = '<table>' +
            '<thead><tr><th>foo</th><th>bar</th></tr></thead>' +
            '<tfoot><tr><th>baz</th><th>qux</th></tr></tfoot>' +
            '<tbody><tr><td>boo</td><td>moo</td></tr></tbody>' +
            '</table>';

        output = '<table>' +
            '<thead><tr><th>foo<th>bar' +
            '<tfoot><tr><th>baz<th>qux' +
            '<tbody><tr><td>boo<td>moo' +
            '</table>';

        assert.equal(htmlmin(input, {
            removeOptionalTags: true
        }), output);
        assert.equal(htmlmin(input), input);
    });

    it('removing optional tags in options', function() {
        input = '<select><option>foo</option><option>bar</option></select>';
        output = '<select><option>foo<option>bar</select>';
        assert.equal(htmlmin(input, {
            removeOptionalTags: true
        }), output);

        // example from htmldog.com
        input = '<select name="catsndogs">' +
            '<optgroup label="Cats">' +
            '<option>Tiger</option><option>Leopard</option><option>Lynx</option>' +
            '</optgroup>' +
            '<optgroup label="Dogs">' +
            '<option>Grey Wolf</option><option>Red Fox</option><option>Fennec</option>' +
            '</optgroup>' +
            '</select>';

        output = '<select name="catsndogs">' +
            '<optgroup label="Cats">' +
            '<option>Tiger<option>Leopard<option>Lynx' +
            '</optgroup>' +
            '<optgroup label="Dogs">' +
            '<option>Grey Wolf<option>Red Fox<option>Fennec' +
            '</optgroup>' +
            '</select>';

        assert.equal(htmlmin(input, {
            removeOptionalTags: true
        }), output);
    });

    it('custom components', function() {
        input = '<custom-component>Oh, my.</custom-component>';
        output = '<custom-component>Oh, my.</custom-component>';

        assert.equal(htmlmin(input), output);
    });

    it('HTML4: anchor with block elements', function() {
        input = '<a href="#"><div>Well, look at me! I\'m a div!</div></a>';
        output = '<a href="#"></a><div>Well, look at me! I\'m a div!</div>';

        assert.equal(htmlmin(input, {
            html5: false
        }), output);
    });

    it('HTML5: anchor with block elements', function() {
        input = '<a href="#"><div>Well, look at me! I\'m a div!</div></a>';
        output = '<a href="#"><div>Well, look at me! I\'m a div!</div></a>';

        assert.equal(htmlmin(input, {
            html5: true
        }), output);
    });

    it('HTML5: enabled by default', function() {
        input = '<a href="#"><div>Well, look at me! I\'m a div!</div></a>';

        assert.equal(htmlmin(input, {
            html5: true
        }), htmlmin(input));
    });

    // https://github.com/kangax/html-minifier/issues/10
    it('Ignored tags: disabled by default', function() {

        input = 'This is the start. <% ... %>\r\n<%= ... %>\r\n<? ... ?>\r\n<!-- This is the middle, and a comment. -->\r\nNo comment, but middle.\r\n<?= ... ?>\r\n<?php ... ?>\r\n<?xml ... ?>\r\nHello, this is the end!';
        assert.equal(htmlmin(input, {
            removeComments: false
        }), input);

        output = 'This is the start. No comment, but middle.Hello, this is the end!';
        assert.equal(htmlmin(input, {
            removeIgnored: true,
            collapseWhitespace: true
        }), output);
    });

    it('bootstrap\'s span > button > span', function() {
        input = '<span class="input-group-btn">' +
            '\n  <button class="btn btn-default" type="button">' +
            '\n    <span class="glyphicon glyphicon-search"></span>' +
            '\n  </button>' +
            '</span>';

        output = '<span class="input-group-btn"><button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button></span>';

        assert.equal(htmlmin(input), output);
    });

    it('caseSensitive', function() {
        input = '<svg class="icon icon-activity-by-tag" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100"></svg>';

        var caseSensitiveOutput = '<svg class="icon icon-activity-by-tag" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100"></svg>';
        var caseInSensitiveOutput = '<svg class="icon icon-activity-by-tag" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewbox="0 0 100 100"></svg>';

        assert.equal(htmlmin(input), caseSensitiveOutput);
        assert.equal(htmlmin(input, {
            caseSensitive: false
        }), caseInSensitiveOutput);
    });

    it('source', function() {

        input = '<audio controls="controls">' +
            '<source src="foo.wav">' +
            '<source src="far.wav">' +
            '<source src="foobar.wav">' +
            '</audio>';
        output = '<audio controls="controls">' +
            '<source src="foo.wav">' +
            '<source src="far.wav">' +
            '<source src="foobar.wav">' +
            '</audio>';

        assert.equal(htmlmin(input, {
            removeOptionalTags: true
        }), output);
    });

    it('nested quotes', function() {
        input = '<p ng-class=\'"test"\'></p>';
        output = '<p ng-class="&quot;test&quot;"></p>';
        assert.equal(htmlmin(input), output);
    });

    it('script minification', function() {
        input = '<script>(function(){ var foo = 1; var bar = 2; alert(foo + " " + bar); })()</script>';
        output = '<script>!function(){var a=1,n=2;alert(a+" "+n)}()</script>';

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);

        input = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-67NT');</script>";
        output = '<script>!function(e,t,a,n,r){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var g=t.getElementsByTagName(a)[0],m=t.createElement(a),s="dataLayer"!=n?"&l="+n:"";m.async=!0,m.src="//www.googletagmanager.com/gtm.js?id="+r+s,g.parentNode.insertBefore(m,g)}(window,document,"script","dataLayer","GTM-67NT")</script>';

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);
    });

    it('on* minification', function() {
        input = '<div onclick="alert(a + b)"></div>';
        output = '<div onclick="alert(a+b)"></div>';

        assert.equal(htmlmin(input, {
            jsmin: false
        }), output);


        assert.equal(htmlmin(input), output);

        input = '<a href="/" onclick="this.href = getUpdatedURL (this.href);return true;">test</a>';
        output = '<a href="/" onclick="return this.href=getUpdatedURL(this.href),!0">test</a>';

        assert.equal(htmlmin(input), output);

        input = "<a onclick=\"try{ dcsMultiTrack('DCS.dcsuri','USPS','WT.ti') }catch(e){}\"> foobar</a>";
        output = "<a onclick=\"try{dcsMultiTrack(\"DCS.dcsuri\",\"USPS\",\"WT.ti\")}catch(t){}\"> foobar</a>";

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);

        input = '<a onClick="_gaq.push([\'_trackEvent\', \'FGF\', \'banner_click\']);"></a>';
        output = '<a onClick="_gaq.push(["_trackEvent","FGF","banner_click"])"></a>';

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);

        input = '<button type="button" onclick=";return false;" id="appbar-guide-button"></button>';
        output = '<button type="button" onclick="return!1" id="appbar-guide-button"></button>';

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);
    });

    it('escaping closing script tag', function() {
        var input = '<script>window.jQuery || document.write(\'<script src="jquery.js"><\\/script>\')</script>';
        var output = '<script>window.jQuery||document.write(\'<script src="jquery.js"><\\/script>\')</script>';

        assert.equal(htmlmin(input, {
            jsmin: false
        }), input);

        assert.equal(htmlmin(input, {
            jsmin: true
        }), output);
    });

    it('style minification', function() {
        input = '<style>div#foo { background-color: red; color: white }</style>';
        output = '<style>div#foo{background-color:red;color:#fff}</style>';

        assert.equal(htmlmin(input), output);
        assert.equal(htmlmin(input, {
            cssmin: false
        }), input);

        input = '<style>div > p.foo + span { border: 10px solid black }</style>';
        output = '<style>div>p.foo+span{border:10px solid #000}</style>';

        assert.equal(htmlmin(input), output);
    });

    it('style attribute minification', function() {
        input = '<div style="color: red; background-color: yellow; font-family: Verdana, Arial, sans-serif;"></div>';
        output = '<div style="color:red;background-color:#ff0;font-family:Verdana,Arial,sans-serif"></div>';

        assert.equal(htmlmin(input), output);
    });

    it('valueless attributes', function() {
        input = '<br foo>';
        assert.equal(htmlmin(input), input);
    })
})
