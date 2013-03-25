(function() {
    var port = 8080,
        http = require("http"),
        url = require("url"),
        fs = require("fs");

    http.createServer(onRequest).listen(port);
    console.log("Server has started. Listening for requests on port " + port + ".");



    function log(request) {
        var path = url.parse(request.url).pathname;
        process.stdout.write(request.connection.remoteAddress + " -> " + request.method + " " + path + " -> ");
    }

    function html(lang, title, body) {
        return "<!doctype html>\r\n"
            + "<html lang=\"" + lang  + "\">\r\n"
            + "<head><title>" + title + "</title></head>\r\n"
            + "<body>\r\n" + body + "\r\n</body>\r\n</html>";
    }

    function http404 (response) {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(html("en", "404","<h1>Sorry, this 404 page is not what you're looking for.</h1>"));
        response.end();
        console.log(404);
    }

    function http500 (response) {
        response.writeHead(500, {"Content-Type": "text/html"});
        response.write(html("en", "Server Error 500","<h1>Sorry, something broke. Try again later (500)</h1>"));
        response.end();
        console.log(500);
    }

    function serveStaticFile(response, filename, contentType) {
        contentType = typeof contentType !== 'undefined' ? contentType : "text/html";

        fs.exists(filename, function (exists) {
            if (!exists) {
                http404(response);
                return;
            }
            fs.readFile(filename, "binary", function (err, file) {
                if (err !== null) {
                    http500(response);
                }
                response.writeHead(200, {"Content-Type": contentType});
                response.write(file, "binary");
                response.end();
                console.log(200);
            });
        });
    }

    function onRequest(request, response) {

        var uri = url.parse(request.url).pathname,
            currDir = process.cwd();

        log(request);

        // route sound resource
        if (uri.indexOf('/assets/sounds/piano/') == 0) {
            serveStaticFile(response, currDir + uri, "audio/mpeg");
            return;
        }

        switch (uri) {
            case "/":
                serveStaticFile(response, currDir + "/piano-css.html");
                break;
            case "/canvas/":
                serveStaticFile(response, currDir + "/piano-canvas.html");
                break;
            case "/canvas":
                serveStaticFile(response, currDir + "/piano-canvas.html");
                break;
            case "/assets/js/jsEar.core.js":
                serveStaticFile(response, currDir + "/assets/js/jsEar.core.js", "application/javascript");
                break;
            case "/assets/js/jsEar.piano-css.js":
                serveStaticFile(response, currDir + "/assets/js/jsEar.piano-css.js", "application/javascript");
                break;
            case "/assets/js/jsEar.events.js":
                serveStaticFile(response, currDir + "/assets/js/jsEar.events.js", "application/javascript");
                break;
            default:
                http404(response);
                break;
        }
    }
}());