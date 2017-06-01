/*================================================*/
// DO INSTALL FUNCTION
/*================================================*/

module.exports = function(allowed_versions,allowed_archs,allowed_regs,subs){

var a_v_list = "";
for (var i = 0; i < allowed_versions.length; i++) {
    a_v_list += ` ${allowed_versions[i]}`;
    if (i < allowed_versions.length - 1) {
        a_v_list += `, `;
    }
}

var a_a_list = "";
for (var i = 0; i < allowed_archs.length; i++) {
    a_a_list += ` ${allowed_archs[i]}`;
    if (i < allowed_archs.length - 1) {
        a_a_list += `, `;
    }
}

var a_r_list = "";
for (var i = 0; i < allowed_regs.length; i++) {
    a_r_list += ` '${allowed_regs[i]}'`;
    if (i < allowed_regs.length - 1) {
        a_r_list += `, `;
    }
}

data =

`
do_install(
    allowed_versions => [ ${a_v_list}  ],
    allowed_os_architectures => [ ${a_a_list} ],
    allowed_regs => [ ${a_r_list} ],
    exit_on_failure => 1`;

if (subs.length) {
    data += `,
`;
}
for (var i = 0; i < subs.length; i++) {
	data +=
`
	${subs[i]}_sub => \\&${subs[i]}`;
            
	if (i < subs.length - 1) {
		data += `, 
		`;
	}

}
data +=
            `
);
`;

return data;
}