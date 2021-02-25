var http = require("http");
var socketIO = require("socket.io");
const mongoose = require('mongoose');



mongoose.connect('mongodb://mongo-service.default.svc.cluster.local:27017/roomr', {useNewUrlParser: true});

var server = http.createServer()
server.listen(8087, "0.0.0.0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const messageSchema = new mongoose.Schema({
    message: String,
    timestamp: String,
    email: String,
    userType: String,
    userName: String,
    houseId: Number
});
const Model = mongoose.model('Message', messageSchema, "messages");


  




io = socketIO(server);






io.on("connection", function(socket) {
    
    socket.on("join", function(data) {
        messageData = JSON.parse(data);
        var houseId = messageData.houseId.toString(10);
        socket.join(houseId);
        Model.find({ houseId: houseId }, function(err, results) {
            if (err) {
                console.log(err);
            } 
            else {
                socket.emit("join", JSON.stringify(results));
            }
        });
    });

    socket.on("message", function(data) {
        messageData = JSON.parse(data);
        var houseId = messageData.houseId.toString(10);
        var doc1 = new Model(messageData);
        console.log(doc1);
        doc1.save(function(err, doc) {
            if (err) {
                console.error(err);
            }
            else {
                io.to(houseId).emit("message", JSON.stringify(doc));
            }
            
        });
    });

    socket.on("leave", function(data) {
        console.log("User has left")
        messageData = JSON.parse(data);
        socket.leave(messageData.houseId.toString(10))
    })
});

