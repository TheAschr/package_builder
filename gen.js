/*================================================*/
// CONFIG
/*================================================*/

var FILE_ROOT = "template";
var FILE_EXT = ".pl"

//var PACK_ID = "test.1_0";
var TARGET_OS = "win10";
var PACK_LOC = "\\\\minerfiles.mst.edu\\dfs\\Software\\itwindist\\"+TARGET_OS+"\\appdist\\";

var MODE = "dev";

//var COMMANDS = ["dir","cd","ls"];

//var ALLOWED_ARCHS = ["OSARCH_x64"];
//var ALLOWED_REGS = [ "clc", "desktop", "traveling","virtual-clc", "virtual-desktop" ];
 
function start(PACK_NAME,SOFT_VER,AUTHOR,PACK_ID_NAME,COMMENTS,SUBS,ALLOWED_VERSIONS,ALLOWED_ARCHS,ALLOWED_REGS,COMMANDS){
	/*================================================*/
	// MAIN FUNCTION
	/*================================================*/
	console.log(SUBS);
	var fs = require("fs");
	var PACK_ID = PACK_ID_NAME.toLowerCase() + '.' + SOFT_VER;

	var dir = initDir(PACK_LOC,MODE,PACK_ID);
	var file = initFile(dir,FILE_ROOT,FILE_EXT);

	return build(file);


	/*================================================*/
	//OTHER FUNCTIONS
	/*================================================*/

	function initDir(loc,mode,id){
		var dir = loc+id+"\\";
		if(fs.existsSync(dir)){
			console.log("DIRECTORY " + dir + " EXISTS");
			dir+=mode+"\\";
			if(!fs.existsSync(dir)){
				//fs.mkdirSync(dir);
			}
			else{
				console.log("DIRECTORY " + dir + " EXISTS");		
			}
			return dir;
		}
		else{
			//fs.mkdirSync(dir);
			dir+=mode+"\\";
			if(!fs.existsSync(dir)){
				//fs.mkdirSync(dir);
			}
			else{
				console.log("DIRECTORY " + dir + " EXISTS");		
			}
			return dir;
		}

		return undefined;
	}

	function initFile(dir,root,ext){
		var logNum = 0;
		while(fs.existsSync(dir+root+String(logNum)+ext))
			logNum++;
		//fs.open(dir+root+String(logNum)+ext,'wx+',function(err,fd){
		// 	if(err){
		// 		return console.log(err);
		// 	}
		// 	console.log("\nFILE " + dir+root+String(logNum)+ext +" CREATED\n");
		// });
		return dir+root+String(logNum)+ext;
	}

	function build(file){
		console.log("BUILDING\n");
		const Template = require("./data.js");
		var data = new Template(PACK_NAME,AUTHOR,COMMENTS,PACK_ID,COMMANDS,SUBS,ALLOWED_VERSIONS,ALLOWED_ARCHS,ALLOWED_REGS);
		// fs.writeFileSync(file,
		// 	data.data
		// );

		return data.data;
	}
}
module.exports = function(name,softVer,author,packId,comments,subs,vers,archs,regs,cmds){
	return start(name,softVer,author,packId,comments,subs,vers,archs,regs,cmds);
}