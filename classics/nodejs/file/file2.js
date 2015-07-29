

/*为文件提供制度数据流*/
var pathname = "test1.txt";

var fs = require('fs');
var rs = fs.createReadStream(pathname);

rs.on('data', function (chunk) {
    console.log(chunk);
});

rs.on('end', function () {
    //cleanUp();
});