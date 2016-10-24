var express = require('express');
var app=express();
var bodyParser = require('body-parser');
var  helmet = require('helmet');
var filecontroller = require('./lib/filecontroller.js');
var routes=require('./routes.js');
var cfg = require('./config.js');

app.use(bodyParser.urlencoded({ extended: true }))
.use(bodyParser.json())
.use(helmet())
.use(express.static(__dirname+'/public'))
.use(express.static(__dirname+'/bower_components'));

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(cfg.serverPort, function(err) {
    if (err)
        return console.log(err);
    console.log('服务启动,端口：' + cfg.serverPort);
});
