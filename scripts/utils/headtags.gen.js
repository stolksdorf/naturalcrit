const _ = require('lodash');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const Storage = require('./storage.js');

const renderTags = ()=>{
	const headTags = _.map(Storage.meta(), (metaProps) => {
		return ReactDOMServer.renderToStaticMarkup(
			React.createElement("meta", metaProps)
		);
	});

	const title = Storage.title();
	if(title){
		headTags.push(ReactDOMServer.renderToStaticMarkup(
			React.createElement("title", null, title)
		));
	}

	//Clear the storage
	Storage.title(null);
	Storage.meta(false);

	return headTags.join('\n');
};

module.exports = renderTags;