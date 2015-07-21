 var sys = require("sys"),  http = require("http");
http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Hello World!!!!");
    response.end();
}).listen(8083);
sys.puts("My first Node.js code.");
sys.puts("Server running at http://localhost:8083/");
