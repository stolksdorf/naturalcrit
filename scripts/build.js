const label = 'build';
console.time(label);

const _     = require('lodash');
const steps = require('vitreum/steps');
const Proj  = require('./project.json');

Promise.resolve()
	.then(()=>steps.clean())
	.then(()=>steps.libs(Proj.libs))
	.then(()=>Promise.all(_.map(Proj.apps, (path, name)=>
		steps.jsx(name, path, {libs : Proj.libs, shared : Proj.shared})
			.then((deps)=>steps.less(name, {shared : Proj.shared}, deps))
	)))
	.then(()=>steps.assets(Proj.assets, ['./client', './shared']))
	.then(()=>console.timeEnd(label))
	.catch((err)=>console.error(err));