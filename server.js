const { json } = require("express");
var http = require("http");
var socketIO = require("socket.io");



var server = http.createServer(function (req, res) {
    res.end()
  });
server.listen(8087, "0.0.0.0");

io = socketIO(server);
io.on("connection", function(socket) {
    
    socket.on("join", function(data) {
        messageData = JSON.parse(data);
        console.log(messageData.userName + " has joined room id: " + messageData.houseId.toString(10));
        socket.join(messageData.houseId.toString(10));
    });


    socket.on("message", function(data) {
        messageData = JSON.parse(data);
        console.log(messageData.message);
        io.to("1").emit("message", messageData);
    });


});