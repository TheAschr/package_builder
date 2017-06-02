

class Sub {
    constructor(name) {

        this.name = name;
        this.commands = {};

        this.getData = function() {
            var temp = "";
            temp +=
                `
sub ${this.name}
{
`;
        if(typeof this.commands !== 'undefined')
        for (var i = 0; i < this.commands.length; i++) {
                temp +=
                    `
    if(!run_command("${this.commands[i].text}"))
    {
        output("EXECUTION OF \\"${this.commands[i].text}\\" IN SUB \\"${this.name}\\" FAILED\\n");
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

class Template {

    constructor(data) {

        this.data = "";

        this.allowed_versions = data.vers;
        this.allowed_archs = data.archs;
        this.allowed_regs = data.regs;

        this.data += this.header = require('./defs/header.js')(data.packName,data.packId,data.author);;

        this.data += this.com = require('./defs/comments.js')(data.comments);

        this.data += this.safe = require('./defs/compilation.js')();

        this.data += this.begin = require('./defs/begin.js')(data.packId);
 
        this.data += this.im_includes = require('./defs/includes.js')();

        this.data += this.getOpts = require('./defs/args.js')(data.subs);

        for (var i = 0; i < data.subs.length; i++) {
            switch (data.subs[i]) {

                case "help":
                    this.help = new Sub("help");
                    this.help.commands = data.cmds.help;
                    this.data += this.help.getData();
                    break;

                case "install":
                    this.install = new Sub("install");
                    this.install.commands = data.cmds.install;
                    this.data += this.install.getData();
                    break;

                case "uninstall":
                    this.uninstall = new Sub("uninstall");
                    this.uninstall.commands = data.cmds.uninstall;
                    this.data += this.uninstall.getData();
                    break;

                case "preinstall":
                    this.preinstall = new Sub("preinstall");
                    this.preinstall.commands = data.cmds.preinstall;
                    this.data += this.preinstall.getData();
                    break;

                case "postinstall":
                    this.postinstall = new Sub("postinstall");
                    this.postinstall.commands = data.cmds.postinstall;
                    this.data += this.postinstall.getData();
                    break;

            }
        }

        this.data += this.do_install = require('./defs/install.js')(data.vers,data.archs,data.regs,data.subs);

        this.data += this.exit = require('./defs/exit.js')();

    }
}

module.exports = Template;