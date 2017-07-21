const React = require('react');
const _     = require('lodash');
const createClass = require('create-react-class');

const BadgeRender = require('./badgeRender/badgeRender.jsx');
const Controls = require('./controls/controls.jsx');





const Badges = createClass({
	getDefaultProps: function() {
		return {

		};
	},
	getInitialState: function() {
		return {
			title: '',
			text: '',
			iconPath : 'https://thenounproject.com/browse/?i=1072583',
			color : '#333'
		};
	},

	handleChange : function(e){
		console.log('hc', e.target.value);
		this.setState({
			text : e.target.value
		})
	},

	render: function(){
		return <div className='badges'>
			<BadgeRender {...this.state} />

			<input type='text' value={this.state.text} onChange={this.handleChange} />
		</div>
	}
});

module.exports = Badges;
