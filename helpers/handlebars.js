function hbsHelpers(hbs) {
	hbs.registerHelper('raw-helper', function(options) {
	    return options.fn();
	});

}

module.exports = hbsHelpers;