/*

//外部访问（proxy服务）
require('http').createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    var auth = 'Basic ' + new Buffer("1996622283241152_default_-21:r5xiya1j66").toString('base64');  // 这里用户名密码请查看“扩展服务”-> “网页代理”
    var options = {
        host: 'proxy.ace.aliyun.com',                        // 这里查看“扩展服务”-> “网页代理”中的“网页代理地址”
        port: 3128,
        method:"GET",
        path: 'https://github.com/floraLam/dailyLearn/blob/master/note/05/0511.md',  // 这里填写你要请求的url
        headers:{
            "Proxy-Authorization": auth,
            Host: "github.com"                        // 这里填写你要请求的目标域名
        }
    };
    var body = "";
    require("http").get(options, function(res) {
        res.on('data', function(chunk) {
            body += chunk.toString();              // 返回请求的内容
        });
        res.on('end', function() {
            response.end(body);                       // 输出请求的内容
        });
    });
}).listen();


*/



















//读取文件







//为文件提供制度数据流
var pathname = "index.html";

var fs = require('fs');
var rs = fs.createReadStream(pathname);


var body;
rs.on('data', function (chunk) {
    body = chunk;
});

rs.on('end', function () {
    //cleanUp();
});



require('http').createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end(body);
}).listen(3000); // ace 中的 http 服务无需填写端口号




