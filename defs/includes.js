/*================================================*/
// INSTALL MONKEY INCLUDES
/*================================================*/

module.exports = function(){

data =  
`
use lib (
'\\\\\\\\minerfiles.mst.edu\\dfs\\software\\loginscripts\\im',
$ENV{'WINDIR'}.'\\SYSTEM32\\UMRINST',
'C:\\temp',
);

use InstallMonkey::Shared;
my $srcfiles = get_pkg_sourcefiles();
`;

return data;
}