const _ = require('lodash');
const path = require('path');

const log = require('../utils/log.js');

const scanFolder = (globs, folder) => {
	const minimatch = require('minimatch');
	const fse = require('fs-extra');
	const walk = require('klaw');

	return new Promise((resolve, reject) => {
		let items = [];
		walk(folder)
			.on('data', (item) => {
				const matched = _.find(globs, (glob) => {
					return minimatch(item.path, glob, {matchBase : true});
				});
				if(matched) items.push(item.path);
			})
			.on('end', function () {
				_.each(items, (assetPath)=>{
					const dest = path.resolve(`./build/assets`, path.relative(folder, assetPath));
					fse.copySync(assetPath, dest);
				});
				return resolve();
			});
		});
};

const runAssets = (globs, folders) => {
	const endLog = log.time('assets');
	return Promise.all(_.map(folders, (folder)=>{
		return scanFolder(globs, folder);
	})).then(endLog);
};

module.exports = runAssets;