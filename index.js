const path = require('path');
const express = require('express'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
const multer = require('multer');
 var upload = multer({ //multer settings
                    dest: 'C:\\Users\\t-als9xd\\Documents\\template generator\\public\\uploads\\',
                }).single('file');


const app = express();

// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(upload.array());
app.use(expressValidator());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\Users\\t-als9xd\\Documents\\template generator\\public\\uploads\\')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});



app.post('/', multipartyMiddleware, function(request, response){ 
    var output = ""; 
    console.log( request.body);


   var file = request.files.file;
   console.log(file);
  // console.log(file.type);
  // console.log(file.path);
    var reqFields = [['input.packName','input.Package Name'],['input.softwareVer','input.Software Version'],['input.author','input.Author']];

    if(request.body.input.packName && request.body.input.softwareVer && request.body.input.author){
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
     
      output = require("./gen.js")(request.body.input.packName,request.body.input.softwareVer,request.body.input.author,request.body.input.packId,request.body.input.comments,subs,vers,archs,regs,cmds);
    
        upload(request,response,function(err){
            if(err){
                 response.json({error_code:1,err_desc:err});
                 return;
            }
        });
    
    }
    else{
      for(var input = 0; input < reqFields.length; input++){
        if(!request.body[reqFields[input][0]]){
          output += "\nERROR: REQUIRED FIELD " + reqFields[input][1] + " NOT COMPLETED\n";
        }
      }
    }
    return response.json({output: output});
});

app.get('/', (request, response) => {  

    return response.json({output: output});
});

app.listen(8081);



console.log("Starting Server");