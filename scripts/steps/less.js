const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const log = require('../utils/log.js');
const isProd = process.env.NODE_ENV === 'production';

const getLessImports = (deps) => {
	return _.reduce(deps, (r, depFilename)=>{
		if(path.extname(depFilename) !== '.jsx') return r;
		const lessPath = depFilename.replace('.jsx', '.less');
		try{
			fs.accessSync(lessPath, fs.constants.R_OK);
			r.unshift(`@import "${lessPath}";`);
		}catch(e){}
		return r;
	},[]).join('\n');
};

const runStyle = (name, opts={}, deps) => {
	const logEnd = log.time(`less[${name}]`);

	if(!_.isPlainObject(opts)) throw 'Less step: opts must be an object';
	opts = _.defaults(opts, {
		filename : 'bundle.css',
		shared : [],
	});
	if(!_.isArray(opts.shared)) throw 'Less step: opts.shared must be an array';

	const less = require('less');

	return new Promise((resolve, reject) => {
		if(!opts.shared && !deps) deps = opts.shared;
		if(!deps) return reject(log.noDeps(name));

		less.render(getLessImports(deps), {
				paths: _.concat(['./node_modules'], opts.shared),
				filename: `${name}.less`,
				compress: isProd,
				sourceMap: {sourceMapFileInline: !isProd}
			},
			(err, res) => {
				if(err){
					log.lessError(err);
					return reject(err);
				}
				fs.writeFile(path.resolve(`./build`, name, opts.filename), res.css, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve();
				});
			});
	});
};

module.exports = runStyle;