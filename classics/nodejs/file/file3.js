/*
	如果写入速度跟不上读取速度的话，只写数据流内部的缓存会爆仓。
	我们可以根据.write方法的返回值来判断传入的数据是写入目标了，
	还是临时放在了缓存了，并根据drain事件来判断什么时候只写数据
	流已经将缓存中的数据写入目标，可以传入下一个待写数据了。
*/

/*为文件提供制度数据流*/
var src = "test1.txt";
var dst = "test2.txt";

var fs = require('fs');

var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', function (chunk) {
    if (ws.write(chunk) === false) {
        rs.pause();
    }
});

rs.on('end', function () {
    ws.end();
});

ws.on('drain', function () {
    rs.resume();
});