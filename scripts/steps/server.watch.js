const _ = require('lodash');
const path = require('path');

const log = require('../utils/log.js');

const watchServer = (serverPath, watchFolders=[])=>{
	log.checkProduction('server-watch');

	const nodemon = require('nodemon');
	nodemon({
		script: serverPath,
		watch: _.map(_.concat(watchFolders, serverPath), (watch)=>path.normalize(watch))
	});
	nodemon.on('restart', (files)=>console.log('Server restart'));

	log.watch(`Enabled server watching`);
	return Promise.resolve();
};

module.exports = watchServer;
