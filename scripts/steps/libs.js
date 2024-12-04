const path = require('path');
const _ = require('lodash');

const log = require('../utils/log.js');
const isProd = process.env.NODE_ENV === 'production';

const runLibs = (libs=[], opts={}) => {
	const logEnd = log.time('libs');

	if(!_.isPlainObject(opts)) throw 'Libs step: opts must be an object';
	opts = _.defaults(opts, {
		filename : 'libs.js',
		shared : [],
	});
	if(!_.isArray(opts.shared)) throw 'Libs step: opts.shared must be an array';

	const browserify = require('browserify');
	const uglify = require('uglify-es');
	const fse = require('fs-extra');

	return new Promise((resolve, reject) => {
		const bundle = browserify({ paths: opts.shared })
			.require(libs)
			.bundle((err, buf) => {
				if(err) return reject(err);
				let code = buf.toString();
				if(isProd){
					try{
						const minified = uglify.minify(buf.toString());
						if(minified.error) return reject(minified.error);
						code = minified.code;
					}catch(e){
						reject(e);
					}
				}
				fse.outputFile(path.resolve(`./build`, opts.filename), code, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve();
				});
			});
	});
};

module.exports = runLibs;