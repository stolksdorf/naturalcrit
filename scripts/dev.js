const label = 'dev';
console.time(label);

const _     = require('lodash');
const steps = require('./steps');
const Proj  = require('./project.json');

Promise.resolve()
	.then(()=>Promise.all(_.map(Proj.apps, (path, name)=>
		steps.jsxWatch(name, path, {libs : Proj.libs, shared : Proj.shared})
			.then((deps)=>steps.lessWatch(name, {shared : Proj.shared}, deps))
	)))
	.then(()=>steps.assetsWatch(Proj.assets, ['./client', './shared']))
	.then(()=>steps.livereload())
	.then(()=>steps.serverWatch('./server.js', ['server']))
	.then(()=>console.timeEnd(label))
	.catch((err)=>console.error(err));