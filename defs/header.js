/*================================================*/
// Header
/*================================================*/


module.exports = function(packName,packId,author){
	
var date = new Date();

data =  
`
#Package Name: ${packName}
#Package ID: ${packId}
#Packaged By: ${author}
#Packaged On: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}
#Last Updated: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}
`;

return data;
}