function start(data){

	return build(data);

	function build(data){
		const Template = require("./data.js");
		var output = new Template(data);

		return output.data;
	}
}
module.exports = function(data){
	return start(data);
}