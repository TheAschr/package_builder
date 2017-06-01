/*================================================*/
// ARGUMENT OPTIONS
/*================================================*/

module.exports = function(subs){

funcList = "";

for (var i = 0; i < subs.length; i++) {

switch (subs[i]) {

	case "help":
	funcList +=
                        `
	'help' => sub { usage(); exit(0); }`;
	break;

	case "install":
	funcList +=
                        `
	'install' => sub { }`;
	break;

	case "uninstall":
	funcList +=
                        `
	'uninstall' => sub { exit(!uninstall()); }`;
	break;

	case "preinstall":
	funcList +=
                        `
	'preinstall' => sub {}`;
	break;

	case "postinstall":
	funcList +=
                        `
	'postinstall' => sub {}`;
	break;
	}

	if (i < subs.length - 1) {
		funcList += `,
		`;
	}
 }

        data =
            `
GetOptions(
` +
            funcList +
            `    
);
`;


return data;
}