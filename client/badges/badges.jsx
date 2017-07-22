const React = require('react');
const _     = require('lodash');
const createClass = require('create-react-class');

const BadgeRender = require('./badgeRender/badgeRender.jsx');
const Controls = require('./controls/controls.jsx');

const Color = require('react-color');


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
			color : '#2b4486'
		};
	},

	handleChange : function(e){
		console.log('hc', e.target.value);
		this.setState({
			text : e.target.value
		})
	},
	handleColorChange : function(colorObj){
		this.setState({
			color : colorObj.hex
		});
	},

	render: function(){
		console.log(this.state.color);
		return <div className='badges'>
			<BadgeRender {...this.state} />

			<Color.ChromePicker
				disableAlpha={true}
				color={ this.state.color }
				onChangeComplete={ this.handleColorChange }
			/>

			<input type='text' value={this.state.text} onChange={this.handleChange} />
		</div>
	}
});

module.exports = Badges;
