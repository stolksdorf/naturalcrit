const _ = require('lodash');
const path = require('path');

const log = require('../utils/log.js');
const HeadTags = require('../utils/headtags.gen.js');

const isProd = process.env.NODE_ENV === 'production';

const requireUncache = (filePath) => {
	delete require.cache[filePath];
};

const getHead = (name) => {
	return `
<link rel="stylesheet" type="text/css" href="/${name}/bundle.css" />
${HeadTags()}
`;
};

const getJS = (name, props) => {
	return `
<script src="/libs.js"></script>
<script src="/${name}/bundle.js"></script>
<script>${runtime(name, props)}</script>`;
};

const runtime = (name, props)=>{
	return `
	(function(){
		var root = document.getElementById('reactRoot');
		if(!root) throw "ERROR: Could not find element with id 'reactRoot' to mount into";
		var element = require('react').createElement(${name}, ${JSON.stringify(props)});
		require('react-dom').render(element, root);
	})();
`;
};

const getBody = (name, props, useStatic) => {
	const ReactDOMServer = require('react-dom/server');
	const React = require('react');

	const bundlePath = path.resolve(`./build/${name}/bundle.js`);
	if(!isProd) requireUncache(bundlePath);
	const Element = require(bundlePath);
	if(_.isEmpty(Element) && !_.isFunction(Element)) throw new Error('Component was improperly built. Check the /build folder.');
	if(useStatic) return ReactDOMServer.renderToStaticMarkup(React.createElement(Element, props));
	return ReactDOMServer.renderToString(React.createElement(Element, props));
};

const render = (name, templateFn, props, fields, opts) => {
	if(!_.isFunction(templateFn)) throw 'No template function provided';
	if(!isProd) require('source-map-support').install();
	opts = _.defaults(opts, { useStatic : false });

	return new Promise((resolve, reject) => {
		try{
			const body = getBody(name, props, opts.useStatic); //body has to render first for head tags
			const page = templateFn({
				head : getHead(name),
				body : body,
				js   : getJS(name, props)
			}, fields);
			return resolve(page);
		}catch(err){
			log.renderError(err, path.resolve(`./build/${name}`));
			return reject(err);
		}
	});
};

module.exports = render;