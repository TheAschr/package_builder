/*================================================*/
// Comment options
/*================================================*/

module.exports = function(comments){

data =  
/*******************/
`
=pod

`
/*******************/
+ "Comments: " + comments
/*******************/
+
/*******************/
`
Begin-Doc
Modified: $Date$
Name: 
Type: script
Description: 
Language: Perl
LastUpdatedBy: $Author$
Version: $Revision$
Doc-Package-Info: 
Doc-SVN-Repository: $URL$
RCSId: $Id$
End-Doc

=cut
`;

return data;
}