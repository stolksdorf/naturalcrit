const _ = require('lodash');
const storage = require('../utils/storage.js');
const log = require('../utils/log.js');

const LessStep = require('./less.js');

const lesswatch = (name, opts={}) => {
	log.checkProduction('less-watch');
	const chokidar  = require('chokidar');

	const watchPaths = _.map(opts.shared, (sharedDir) => {
		return `${sharedDir}/**/*.less`;
	});
	watchPaths.push(`${storage.entryDir(name)}/**/*.less`);

	return LessStep(name, opts, storage.deps(name))
		.then(() => {
			chokidar.watch(watchPaths, {ignoreInitial : true})
				.on('change', ()=>{
					LessStep(name, opts, storage.deps(name))
				});
			log.watch(`Enabling less-watch for ${name}`);
		});
};

module.exports = lesswatch;
