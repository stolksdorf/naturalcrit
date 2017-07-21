const React = require('react');
const _     = require('lodash');
const createClass = require('create-react-class');

const Controls = createClass({
	getDefaultProps: function() {
		return {

		};
	},
	render: function(){
		return <div className='controls'>
			Controls Component Ready.
		</div>
	}
});

module.exports = Controls;
