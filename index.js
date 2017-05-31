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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, data_dir + 'data/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
        storage: storage,
    onError : function(err, next) {
      console.log('error', err);
      next(err);
    }
});


var mode;
var packId;



app.post('/', upload.none(), function(request, response){ 

    request.checkBody('input.packName', 'ERROR: PACKAGE NAME REQUIRED').notEmpty();
    request.checkBody('input.author', 'ERROR: AUTHOR REQUIRED').notEmpty();;
    request.checkBody('input.packId', 'ERROR: PACKAGE ID REQUIRED').notEmpty();;
    request.checkBody('input.softwareVer', 'ERROR: SOFTWARE VERSION REQUIRED').notEmpty();;

    request.body.input.softwareVerNum = request.body.input.softwareVer.replace('.', '');
    request.checkBody('input.softwareVerNum', 'ERROR: SOFTWARE VERSION MUST BE NUMERIC').isNumeric();;

    request.body.input.softwareVer = request.body.input.softwareVer.replace('.', '_');
    packId = request.body.input.packId.replace(/\s+/g, '').toLowerCase() + '.' + request.body.input.softwareVer;  
    
    if(request.body.input.mode == 'Development'){
      mode = 'dev';
    }
    if(request.body.input.mode == 'Production'){
      mode = 'prod';
    }  

    output = ""; 
    if(!request.validationErrors()){
      var regs = [];
      if(request.body.input.clc){
        regs.push('clc');
      }
      if(request.body.input.desktop){
        regs.push('desktop');
      }
      if(request.body.input.traveling){
        regs.push('traveling');
      }
      if(request.body.input.vClc){
        regs.push('virtual-clc');
      }
      if(request.body.input.vDesktop){
        regs.push('virtual-desktop');
      }


      var archs = [];
      if(request.body.input.arch32){
        archs.push('OSARCH_x32');
      }
      if(request.body.input.arch64){
        archs.push('OSARCH_x64');
      }

      var vers = [];
      if(request.body.input.xp32){
        vers.push('OSVER_XP_32');
      }
      if(request.body.input.vista_0){
        vers.push('OSVER_VISTA_SP0');
      }
      if(request.body.input.vista_1){
        vers.push('OSVER_VISTA_SP1');
      }
      if(request.body.input.vista_2){
        vers.push('OSVER_VISTA_SP2');
      }
      if(request.body.input.win7_0){
        vers.push('OSVER_WIN7_SP0');
      }
      if(request.body.input.win7_1){
        vers.push('OSVER_WIN7_SP1');
      }
      if(request.body.input.win8){
        vers.push('OSVER_WIN8_SP0');
      }
      if(request.body.input.win10_0){
        vers.push('OSVER_WIN10_SP0');
      }
      if(request.body.input.win10_1){
        vers.push('OSVER_WIN10_SP1');
      }

      var subs = [];
      if(request.body.input.help){
        subs.push('help');
      }
      if(request.body.input.uninstall){
        subs.push('uninstall');
      }
      if(request.body.input.install){
        subs.push('install');
      }
      if(request.body.input.postinstall){
        subs.push('postinstall');
      }
      if(request.body.input.preinstall){
        subs.push('preinstall');
      }


      var helpCmds = Object.keys(request.body).filter(function(k) {
          return k.indexOf('input.helpCmd') == 0;
      }).reduce(function(newData, k) {
          newData[k] = request.body[k];
          var output = [];
          for(var key in newData){
            output.push(newData[key]);
          }
          return output;
      }, {});

      var instCmds = Object.keys(request.body).filter(function(k) {
          return k.indexOf('input.instCmd') == 0;
      }).reduce(function(newData, k) {
          newData[k] = request.body[k];
          var output = [];
          for(var key in newData){
            output.push(newData[key]);
          }
          return output;
      }, {});

      var uninstCmds = Object.keys(request.body).filter(function(k) {
          return k.indexOf('input.unCmd') == 0;
      }).reduce(function(newData, k) {
          newData[k] = request.body[k];
          var output = [];
          for(var key in newData){
            output.push(newData[key]);
          }
          return output;
      }, {});
      
      var preCmds = Object.keys(request.body).filter(function(k) {
          return k.indexOf('input.preCmd') == 0;
      }).reduce(function(newData, k) {
          newData[k] = request.body[k];
          var output = [];
          for(var key in newData){
            output.push(newData[key]);
          }
          return output;
      }, {});
      
      var postCmds = Object.keys(request.body).filter(function(k) {
          return k.indexOf('input.poCmd') == 0;
      }).reduce(function(newData, k) {
          newData[k] = request.body[k];
          var output = [];
          for(var key in newData){
            output.push(newData[key]);
          }
          return output;
      }, {});

        var cmds = [helpCmds,instCmds,uninstCmds,preCmds,postCmds];
     
        output = require("./gen.js")(request.body.input.packName,request.body.input.softwareVer,request.body.input.author,packId,request.body.input.comments,subs,vers,archs,regs,cmds);
      }
      else{
        for(var error in request.validationErrors()){
          output+= request.validationErrors()[error].msg + '\n';
        }
      }
      return response.json({output: output});
});

app.get('/', (request, response) => {  

    return response.json({output: output});
});

function publishData(request, response,next){
      if(typeof output !== 'undefined' && mode !== '' && packId !== ''){
        data_dir = require("./publish.js")(output,mode,packId);
        return next();
      }
      else{
          console.log("ERROR: OUTPUT NOT DEFINED");
      }
}
app.post('/publish' , publishData, upload.any());

app.use(function(req, res, next){


  // respond with json
  if (req.accepts('json')) {
    res.send();
    return;
  }
});

app.listen(8081);



console.log("Starting Server");