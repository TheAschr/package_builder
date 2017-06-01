var FILE_ROOT = "update";
var FILE_EXT = ".pl"

var TARGET_OS = "win10";
var PACK_LOC = "\\\\minerfiles.mst.edu\\dfs\\Software\\itwindist\\"+TARGET_OS+"\\appdist\\";


const fs = require("fs");

function publish(data,mode,packId){
	if(packId !== '.'){
		var dir = initDir(PACK_LOC,mode,packId);
		var file = initFile(dir,FILE_ROOT,FILE_EXT);

		write(file,data);
		return dir;
	}

	function initDir(loc,mode,id){
		var dir = loc+id+"\\";
		if(fs.existsSync(dir)){
			console.log("DIRECTORY " + dir + " EXISTS");
			dir+=mode+"\\";
			if(!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			else{
				console.log("DIRECTORY " + dir + " EXISTS");		
			}
			var dataDir = dir+'\\data';
			if(!fs.existsSync(dataDir)){
				fs.mkdirSync(dataDir);
			}
			else{
				console.log("DIRECTORY " + dataDir + " EXISTS");		
			}		
			return dir;
		}
		else{
			fs.mkdirSync(dir);
			dir+=mode+"\\";
			if(!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			else{
				console.log("DIRECTORY " + dir + " EXISTS");		
			}
			var dataDir = dir+'\\data';
			if(!fs.existsSync(dataDir)){
				fs.mkdirSync(dataDir);
			}
			else{
				console.log("DIRECTORY " + dataDir + " EXISTS");		
			}	
			return dir;
		}

		return undefined;
	}

	function initFile(dir,root,ext){
		var logNum = 0;
		while(fs.existsSync(dir+root+String(logNum)+ext))
			logNum++;
		fs.open(dir+root+String(logNum)+ext,'wx+',function(err,fd){
			if(err){
				return console.log(err);
			}
			console.log("\nFILE " + dir+root+String(logNum)+ext +" CREATED\n");
		});
		return dir+root+String(logNum)+ext;
	}

	function write(file,data){
		fs.writeFileSync(file,
			data
		);
	}
}

module.exports = function(data,mode,packId){
	return publish(data,mode,packId);
}