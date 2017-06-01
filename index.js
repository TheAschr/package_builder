const path = require('path');
const express = require('express'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
const multer = require('multer');

const app = express();

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, data_dir + 'data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage,
    onError: function(err, next) {
        console.log('error', err);
        next(err);
    }
});


var data;
var output;


app.post('/', upload.none(), function(request, response) {
    
    console.log("Submit Request From: " + request.connection.remoteAddress);

    request.checkBody('input.packName', 'ERROR: PACKAGE NAME REQUIRED').notEmpty();
    request.checkBody('input.author', 'ERROR: AUTHOR REQUIRED').notEmpty();
    request.checkBody('input.packId', 'ERROR: PACKAGE ID REQUIRED').notEmpty();
    request.checkBody('input.softwareVer', 'ERROR: SOFTWARE VERSION REQUIRED').notEmpty();
    request.checkBody('input.mode', 'ERROR: MODE REQUIRED').notEmpty();

    request.body.input.softwareVerNum = request.body.input.softwareVer.replace('.', '');
    request.checkBody('input.softwareVerNum', 'ERROR: SOFTWARE VERSION MUST BE NUMERIC').isNumeric();

    request.body.input.softwareVer = request.body.input.softwareVer.replace('.', '_');
    packId = request.body.input.packId.replace(/\s+/g, '').toLowerCase() + '.' + request.body.input.softwareVer;


    output = "";
    var date = new Date();

    if (!request.validationErrors()) {
        var regs = [];
        for(reg in request.body.input.regs){
          if(request.body.input.regs[reg] == 'true'){
            regs.push(reg);
          }
        }

        var archs = [];
        for(arch in request.body.input.archs){
          if(request.body.input.archs[arch] == 'true'){
            archs.push(arch);
          }
        }

        var vers = [];
        for(ver in request.body.input.vers){
          if(request.body.input.vers[ver] == 'true'){
            vers.push(ver);
          }
        }


        var subs = [];
        for(sub in request.body.input.subs){
          if(request.body.input.subs[sub] == 'true'){
            subs.push(sub);
          }
        }

        data = {
            packName: request.body.input.packName,
            softwareVer: request.body.input.softwareVer,
            author: request.body.input.author,
            packId: packId,
            comments: request.body.input.comments,
            subs: subs,
            vers: vers,
            archs: archs,
            regs: regs,
            cmds: request.body.input.commands,
            mode: request.body.input.mode
        };
        output = require("./gen.js")(data);
        return response.json({
            output: output,
            alert: {type: 'success', time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() , text: "Submit Successful" }
        });

    } else {
        for (var error in request.validationErrors()) {
            output += request.validationErrors()[error].msg + '\n';
        }
      return response.json({
        output: output,
        alert: {type: 'danger', time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() , text: "Submit Error" }
      });
    }

});

app.get('/', (request, response) => {

    return response.json({
        output: output
    });
});

function publishData(request, response, next) {
    console.log("Publish Request From: " + request.connection.remoteAddress);


    if (typeof output !== '') {
        data_dir = require("./publish.js")(output, data.mode, data.packId);
        return next();
    } else {
        console.log("ERROR: OUTPUT NOT DEFINED");
    }
    return response.json({
      output: output,
      alert: {type: 'success', time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() , text: "Publish Error" }
    });
}
app.post('/publish', publishData, upload.any());



app.listen(8081);



console.log("Starting Server");