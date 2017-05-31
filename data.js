var DATE = new Date();


class Sub {
    constructor(name) {

        this.name = name;
        this.commands = [];

        this.getData = function() {
            var temp = "";
            temp +=
                `
sub ${this.name}
{
`;

            for (var i = 0; i < this.commands.length; i++) {
                temp +=
                    `
    if(!run_command("${this.commands[i]}"))
    {
        output("EXECUTION OF \\"${this.commands[i]}\\" IN SUB \\"${this.name}\\" FAILED\\n");
        return 0;
    }
`;
			}

            temp +=
                `
	return 1;
}
`;
			
            return temp;
        }
    }
}

/*================================================*/
// TEMPLATE CLASS
/*================================================*/

class Template {

    constructor(name, author, comments, packId, commands, subs, a_v, a_a, a_r) {
        //data

        this.data = "";
        this.name = name;

        this.author = author;
        this.comments = comments;
        this.packId = packId;
        this.commands = commands;
        this.subs = subs;
        this.year = DATE.getFullYear();
        this.month = DATE.getMonth();
        this.day = DATE.getDate();
        this.hour = DATE.getHours();
        this.minute = DATE.getMinutes();

        //do_install options
        this.allowed_versions = a_v;
        this.allowed_archs = a_a;
        this.allowed_regs = a_r;

        //custom subs
        this.help = new Sub("help");
        this.help.commands = this.commands[0];
       
        this.install = new Sub("install");
        this.install.commands = this.commands[1];
       	
       	this.uninstall = new Sub("uninstall");
        this.uninstall.commands = this.commands[2];

        
        this.preinstall = new Sub("preinstall");
        this.preinstall.commands = this.commands[3];

       
        this.postinstall = new Sub("postinstall");
        this.postinstall.commands = this.commands[4];

        
        this.do_install = new Sub("do_install");
        this.do_install.commands = this.commands[5];


        /*================================================*/
        // HEADER
        /*================================================*/
        this.header =
            `
#Package Name: ${this.name}
#Package ID: ${this.packId}
#Packaged By: ${this.author}
#Packaged On: ${this.year}-${this.month}-${this.day}
#Last Updated: ${this.year}-${this.month}-${this.day}
`;


        /*================================================*/
        // Comment options
        /*================================================*/

        this.com =
            `
=pod

`;
        this.com += "Comments: " + this.comments;
        this.com +=
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

        /*================================================*/
        // OPTIONS FOR SAFE COMPILATION
        /*================================================*/

        this.safe =
            `
use strict;
use warnings;
use Win32::TieRegistry;
`;

        /*================================================*/
        // BEGIN FUNCTION
        /*================================================*/

        this.begin =
            `
our %INSTALLMONKEY_OPTIONS;
BEGIN {
	%::INSTALLMONKEY_OPTIONS = (
		package_id => '${this.packId}',
		package_revision => '${this.year}${this.month}${this.day}T${this.hour}${this.minute}',
	);
}
`;

        /*================================================*/
        // INSTALL MONKEY INCLUDES
        /*================================================*/

        this.im_includes =
            `
use lib (
'\\\\\\\\minerfiles.mst.edu\\dfs\\software\\loginscripts\\im',
$ENV{'WINDIR'}.'\\SYSTEM32\\UMRINST',
'C:\\temp',
);

use InstallMonkey::Shared;
my $srcfiles = get_pkg_sourcefiles();
`;

        /*================================================*/
        // GET OPTIONS
        /*================================================*/

        var funcList = "";
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

        this.getOpts =
            `
GetOptions(
` +
            funcList +
            `    
);
`;

        /*================================================*/
        // DO INSTALL
        /*================================================*/

        var a_v_list = "";
        for (var i = 0; i < this.allowed_versions.length; i++) {
            a_v_list += ` ${this.allowed_versions[i]}`;
            if (i < this.allowed_versions.length - 1) {
                a_v_list += `, `;
            }
        }

        var a_a_list = "";
        for (var i = 0; i < this.allowed_archs.length; i++) {
            a_a_list += ` ${this.allowed_archs[i]}`;
            if (i < this.allowed_archs.length - 1) {
                a_a_list += `, `;
            }
        }

        var a_r_list = "";
        for (var i = 0; i < this.allowed_regs.length; i++) {
            a_r_list += ` '${this.allowed_regs[i]}'`;
            if (i < this.allowed_regs.length - 1) {
                a_r_list += `, `;
            }
        }

        this.do_install =
            `
do_install(
    allowed_versions => [ ${a_v_list}  ],
    allowed_os_architectures => [ ${a_a_list} ],
    allowed_regs => [ ${a_r_list} ],
    exit_on_failure => 1`;
        if (this.subs.length) {
            this.do_install += `,
`;
        }
        for (var i = 0; i < this.subs.length; i++) {
            this.do_install +=
                `
	${this.subs[i]}_sub => \\&${this.subs[i]}`;
            if (i < this.subs.length - 1) {
                this.do_install += `, 
		`;
            }
        }
        this.do_install +=
            `
);
`;

        /*================================================*/
        // EXIT STATUS
        /*================================================*/

        this.exit =
            `
IM_Exit(EXIT_SUCCESS);
`;
        /*================================================*/
        // BUILD DATA
        /*================================================*/

        this.data += this.header;
        this.data += this.com;
        this.data += this.safe;
        this.data += this.begin;
        this.data += this.im_includes;
        this.data += this.getOpts;
        for (var i = 0; i < this.subs.length; i++) {
            switch (this.subs[i]) {

                case "help":
                    this.data += this.help.getData();
                    break;

                case "install":
                    this.data += this.install.getData();
                    break;

                case "uninstall":
                    this.data += this.uninstall.getData();
                    break;

                case "preinstall":
                    this.data += this.preinstall.getData();
                    break;

                case "postinstall":
                    this.data += this.postinstall.getData();
                    break;

            }
        }
        this.data += this.do_install;
        this.data += this.exit;

    }
}
/*================================================*/
// MODULE EXPORTS
/*================================================*/

module.exports = Template;