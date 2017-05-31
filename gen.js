


function start(PACK_NAME,SOFT_VER,AUTHOR,PACK_ID,COMMENTS,SUBS,ALLOWED_VERSIONS,ALLOWED_ARCHS,ALLOWED_REGS,COMMANDS){
	/*================================================*/
	// MAIN FUNCTION
	/*================================================*/
	console.log(SUBS);
	return build();


	/*================================================*/
	//OTHER FUNCTIONS
	/*================================================*/

	function build(){
		const Template = require("./data.js");
		var data = new Template(PACK_NAME,AUTHOR,COMMENTS,PACK_ID,COMMANDS,SUBS,ALLOWED_VERSIONS,ALLOWED_ARCHS,ALLOWED_REGS);

		return data.data;
	}
}
module.exports = function(name,softVer,author,packId,comments,subs,vers,archs,regs,cmds){
	return start(name,softVer,author,packId,comments,subs,vers,archs,regs,cmds);
}