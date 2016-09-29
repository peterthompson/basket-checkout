const http = require("http");
const dispatcher = require("httpdispatcher");

const PORT = 9001; // server port

// deliver information that the server is running
dispatcher.onGet("/", function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("The server is running but this endpoint is not required for the Challenge");
});

dispatcher.onGet("/products", require("./endpoints/products"));

// handle a promo code
// for a valid promo code submission return a message indicating an appropriate percentage discount
dispatcher.onPost("/promocode", require("./endpoints/promocode"));

// handle a checkout transaction
dispatcher.onPost("/checkout", require("./endpoints/checkout"));

console.log("\n * STARTING Node Server * \n");

//Create the HTTP server
var server = http.createServer(function handleRequest(req, res) {
    try {
        console.log(req.url);
        dispatcher.dispatch(req, res);
    } catch (err) {
        console.log(err);
    }
});

//start the server
server.listen(PORT, function () {
    console.log("Basket Checkout Node Server listening on: http://localhost:" + PORT);
});
