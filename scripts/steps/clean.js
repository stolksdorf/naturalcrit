const log = require('../utils/log.js');

const clean = () => {
	const endLog = log.time('clean');
	const fse = require('fs-extra');

	return new Promise((resolve, reject) => {
		fse.emptydir('./build', (err)=>{
			if(err) return reject(err);
			endLog();
			return resolve();
		});
	});
};


module.exports = clean;