const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');

const NaturalCritIcon = require('naturalcrit/svg/naturalcrit.svg.jsx');
const AccountActions = require('../account.actions.js');

const RedirectLocation = 'NC-REDIRECT-URL';

const SuccessPage = React.createClass({
	getDefaultProps: function() {
		return {
			redirect : '',
			user : null
		};
	},
	getInitialState: function() {
		return {
			view : 'login', //or 'signup'
			visible : false,

			username : '',
			password : '',

			processing : false,
			checkingUsername : false,
			redirecting : false,

			usernameExists : false,

			errors : null,
			success : false,
		};
	},
	componentDidMount: function() {
		const redirectURL = window.sessionStorage.getItem(RedirectLocation) || '/';
		window.sessionStorage.removeItem(RedirectLocation);
		setTimeout(function(){window.location=redirectURL;}, 1500);
 },
 render : function(){
	 return <div className='loginPage'>
		 <div className='logo'>
			 <NaturalCritIcon />
			 <span className='name'>
				 Natural
				 <span className='crit'>Crit</span>
			 </span>
		 </div>


		 <div className='content'>
		 <p>Successfully logged in!</p>
		 <br />
		 <br />
		 <p>Redirecting...</p>
		 </div>

	 </div>
 }
});

module.exports = SuccessPage;
