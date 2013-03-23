(function() {
    var port = 8080,
        http = require("http"),
        url = require("url"),
        fs = require("fs");

    http.createServer(onRequest).listen(port);
    console.log("Server has started. Listening for requests on port " + port + ".");

    function onRequest(request, response) {

        var uri = url.parse(request.url).pathname;

        log(request);

        if (uri !== '/') {
            http404(response);
            return;
        }
        var filename = process.cwd() + "/index.html";
        fs.exists(filename, function (exists){
            if (!exists) {
                http500(response);
            }
            fs.readFile(filename, "binary", function(err, file) {
                if (err !== null) {
                    http500(response);
                }
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
                console.log(200);
            });
        });
    }

    function http404 (response) {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(html("en", "404","<h1>Sorry, this 404 page is not what you're looking for.</h1>"));
        response.end();
        console.log(400);
    }

    function http500 (response) {
        response.writeHead(500, {"Content-Type": "text/html"});
        response.write(html("en", "Server Error 500","<h1>Sorry something broke. Try again later (500)</h1>"));
        response.end();
        console.log(500);
    }

    function html(lang, title, body) {
        return "<!doctype html>\r\n"
            + "<html lang=\"" + lang  + "\">\r\n"
            + "<head><title>" + title + "</title></head>\r\n"
            + "<body>\r\n" + body + "\r\n</body>\r\n</html>";
    }

    function log(request) {
        var path = url.parse(request.url).pathname;
        process.stdout.write(request.connection.remoteAddress + " -> " + request.method + " " + path + " -> ");
    }
}());