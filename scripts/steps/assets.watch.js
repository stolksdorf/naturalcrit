const _ = require('lodash');
const log = require('../utils/log.js');

const assetwatch = (globs, folders) => {
	log.checkProduction('assets-watch');

	const chokidar  = require('chokidar');
	const assets = require('./assets.js');

	const allPaths = _.reduce(folders, (r, folder) => {
		return _.concat(r, _.map(globs, (glob) => {
			return `${folder}/**/${glob}`;
		}));
	}, []);

	return assets(globs, folders)
		.then(() => {
			chokidar.watch(allPaths, {ignoreInitial : true})
				.on('add', ()=>assets(globs, folders))
				.on('change', ()=>assets(globs, folders))
				.on('unlink', ()=>assets(globs, folders));

			log.watch(`Enabling asset-watch`);
		});
};

module.exports = assetwatch;