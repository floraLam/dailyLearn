var net = require("net");
 var server = net.createServer(function(socket) {
    socket.setEncoding("utf8");
    var buffer = [], len = 0;
    socket.on("data", function(data) { // 接收到客户端数据
        if (data.charCodeAt(0) == 13) {
            var expr = buffer.join("");
            try {
                var result = eval(expr); // 进行计算
                socket.write(result.toString()); // 写回结果
            } catch (e) {
                socket.write("Wrong expression.");
            } finally {
                socket.write("\r\n");
                buffer = [];
            }
        }
        else {
            buffer.push(data);
        }
    });
 });
 server.listen(8180, "127.0.0.1");
 console.log("服务器已经在端口 8180 启动。");