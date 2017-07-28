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
			rawSVG: ''
			//rawSVG : `<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>50Icon_5px_grid</title><path d="M93.43,42a1.57,1.57,0,0,0-.65-1L61.47,19.21a1.57,1.57,0,0,0-2.18.39l-4.6,6.6a1.57,1.57,0,0,0,.39,2.18l.73.51-5.7,8.19a1.57,1.57,0,1,0,2.57,1.79l5.7-8.19,1.33.92L54,39.8a1.57,1.57,0,0,0,2.57,1.79l5.7-8.19,1.33.92-5.7,8.19a1.57,1.57,0,1,0,2.57,1.79l5.7-8.19L67.5,37l-5.7,8.19A1.57,1.57,0,0,0,64.37,47l5.7-8.19,1.33.92-5.7,8.19a1.57,1.57,0,1,0,2.57,1.79L74,41.55l1.33.92-5.7,8.19a1.57,1.57,0,0,0,2.57,1.79l5.7-8.19,1.33.92-5.7,8.19a1.57,1.57,0,1,0,2.57,1.79L81.77,47l1.33.92-5.7,8.19A1.57,1.57,0,1,0,80,57.89l5.7-8.19.73.51a1.57,1.57,0,0,0,2.18-.39l4.6-6.6A1.56,1.56,0,0,0,93.43,42Zm-6.53,4.7-.72-.5h0l-3.88-2.71h0L78.38,40.8h0l-3.88-2.71h0l-3.89-2.71h0l-3.88-2.71h0l-3.89-2.71h0l-3.89-2.71h0l-.72-.5,2.81-4,28.75,20Z"/><path d="M87.69,69.57c-1.28-4.69-6.83-6-13.26-7.53a60.75,60.75,0,0,1-9.9-3c-6.84-2.94-13.31-8.9-18-13.25C45.17,44.62,44,43.54,43,42.7,41.25,41.21,39.43,40,38,41c-.87.6-1.11,1.77-.69,3.16v4.06l-5.83,3.37c-4.81,2.78-5.06,2.64-9.25.19-.8-.47-1.72-1-2.8-1.6C13.84,47.12,12,47.28,11,47.77a2.1,2.1,0,0,0-1,.9C3,58.29,8.66,71.14,9.81,73.49v5A1.57,1.57,0,0,0,11.37,80h17A1.57,1.57,0,0,0,30,78.45V74a14.33,14.33,0,0,1,3.49,0c2,.19,4.11,1.56,6.61,3.15,1.36.86,2.76,1.75,4.33,2.59,1.86,1,6.07,1.35,11.62,1.35,5.79,0,13-.39,20.6-.84C79,80.09,81,80,82.42,79.9c3.24-.14,5.45-.53,6.49-2.06s.43-3.26-.33-5.47C88.3,71.56,88,70.63,87.69,69.57Zm-1.37,6.5c-.08.09-.64.55-4,.7-1.46.06-3.48.18-5.83.33-8.83.53-27.21,1.64-30.55-.14-1.46-.78-2.82-1.64-4.13-2.47-2.72-1.72-5.28-3.35-8-3.62-.75-.07-1.43-.1-2-.1a11.21,11.21,0,0,0-3.92.56,1.57,1.57,0,0,0-1,1.46v4.11H12.94V73.12a1.58,1.58,0,0,0-.18-.73c-.07-.13-6.63-12.93-.31-21.75.54.06,2,.41,5.45,2.28,1.06.58,1.95,1.1,2.73,1.56,4.77,2.78,6.27,3.37,12.4-.18l6.61-3.83a1.57,1.57,0,0,0,.78-1.36V44.64l.55.45c1,.82,2.11,1.87,3.4,3.06,1,.92,2.07,1.91,3.21,2.93L42,57.78a1.57,1.57,0,0,0,2.41,2l5.53-6.64c1,.85,2,1.71,3.11,2.54l-5,6a1.57,1.57,0,0,0,2.41,2l5.09-6.11,0-.06A43.17,43.17,0,0,0,63.29,62,63.79,63.79,0,0,0,73.71,65.1c5.45,1.3,10.16,2.41,11,5.31.31,1.13.65,2.12.95,3A9.64,9.64,0,0,1,86.32,76.07Z"/><text x="0" y="115" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Loka Mariella</text><text x="0" y="120" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text></svg>`
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
