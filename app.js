var express = require("express");
var app = express();

var mongojs = require("mongojs");

var db = mongojs("localhost:27017/testDB", ["confessCol"]);

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/confession", function(req, res){
    var name = req.body.name;
    var text = req.body.text;
    var date = new Date();
    //error checking, "===" strict check, in "==", undefined=null so stuff is good yay
    
    if (name == null || text == null){
        return res.send("error!");
    }
    
    db.confessCol.save({name: name, text: text, createdAt: date}, function(err,docs){
       if (err){
           res.send({status: 403, message: "Error: " + docs});
       }else{
           res.send({status: 200, data:{name: name, text: text, createdAt: date}});
       }
    });
    
    // http://localhost:8080/confession/Somebody/Something awesome to be be confessed here/A Date/
    
    // http://localhost:8080/confession
    });
    
app.get("/confession/all", function(req,res){
    var page = (req.query.page == undefined) ? 0 : parseInt(req.query.page);
    var limit = (req.query.limit == undefined) ? 10 : parseInt(req.query.limit);

    db.confession.find().limit(limit).skip(page * limit).sort({createdAt: -1}).toArray(function(err, docs){
        if (err){
            res.send("Server death. RIP.");
        }
        else{
            res.send({status: 200, 
            data: docs});
        }
    });
});

app.post("/confession/deleteAll", function(req, res){//so you delete ONLY confessions
    var password = req.body.password; //not rly safe bc can be hacked!!! personal information can be stole 
    
    if (password != "super awesome password"){
        return res.send("error not authorised!")
    }
    
    db.confessCol.remove(function(err,docs){
        res.send(docs);
    });
})



// /deleteById/:id
app.delete("/confession/deleteById/:id", function(req,res){//better understanding of what is going on for the OTHER HUMANS
    var id = req.params.id;
    db.confessCol.remove({_id: mongojs.ObjectId(id)}, true, function(err,docs){ //mongojs.ObjectID(id) ensures that it does not delete by a string???
        res.send(docs);
    });
});

app.delete("/confession/deleteByName/:name", function(req,res){
    var name = req.params.name;
    db.confessCol.remove({name: name}, function(err,docs){ //mongojs.ObjectID(id) ensures that it does not delete by a string???
        res.send(docs);
    });
});

app.listen(8080);