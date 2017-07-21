const React = require('react');
const _     = require('lodash');
const createClass = require('create-react-class');

const Badges = createClass({
	getDefaultProps: function() {
		return {

		};
	},
	render: function(){
		return <div className='badges'>
			Badges Component Ready.
		</div>
	}
});

module.exports = Badges;
