global.naturalcrit = {
	title : null,
	meta : [],
	deps : {},
	entryDir : {}
};

module.exports = {
	title : (val=false) => {
		if(val !== false) global.naturalcrit.title = val;
		return global.naturalcrit.title;
	},
	meta : (val) => {
		if(val === false) global.naturalcrit.meta = [];
		if(val) global.naturalcrit.meta.push(val);
		return global.naturalcrit.meta;
	},
	deps : (name, val) => {
		if(val) global.naturalcrit.deps[name] = val;
		return global.naturalcrit.deps[name];
	},
	entryDir : (name, val) => {
		if(val) global.naturalcrit.entryDir[name] = val;
		return global.naturalcrit.entryDir[name];
	}
};