const React = require('react');
const _     = require('lodash');
const createClass = require('create-react-class');

const BadgeRender = require('./badgeRender/badgeRender.jsx');
const Controls = require('./controls/controls.jsx');

const NCLogo = require('naturalcrit/svg/naturalcrit.svg.jsx');

const Badges = createClass({
	getDefaultProps: function() {
		return {

		};
	},
	getInitialState: function() {
		return {
			title: '',
			text: '',
			color : '#2b4486',
			rawSVG : ``
		};
	},

	render: function(){
		return <div className='badges'>

			<h1>D&D Achivement Badges</h1>
			<p>Want to give your players a little something extra? Create a custom achivement badge just for them!</p>
			<div className='content'>
				<Controls data={this.state} onChange={(newState)=>this.setState(newState)} />
				<BadgeRender {...this.state} />

			</div>
		</div>
	}
});

module.exports = Badges;
