/*================================================*/
// Begin Function
/*================================================*/

module.exports = function(packId){
var date = new Date();

data =  
`
our %INSTALLMONKEY_OPTIONS;
BEGIN {
	%::INSTALLMONKEY_OPTIONS = (
		package_id => '${packId}',
		package_revision => '${date.getFullYear()}${date.getMonth()}${date.getDate()}T${date.getHours()}${date.getMinutes()}',
	);
}
`;

return data;
}