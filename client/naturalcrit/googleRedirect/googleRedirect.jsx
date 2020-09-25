const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');

const NaturalCritIcon = require('naturalcrit/svg/naturalcrit.svg.jsx');
const AccountActions = require('../account.actions.js');

const GoogleRedirect = React.createClass({
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
	  // get the URL parameters which will include the auth token
		//const params = window.location.search;
	  // if (window.opener) {
	  //   // send them to the opening window
	  //   window.opener.postMessage(params);
	  //   // close the popup
	  //   window.close();
	  // }
	 // some text to show the user
	 AccountActions.loginGoogle(this.props.authToken);
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
		 </div>

	 </div>
 }
});

module.exports = GoogleRedirect;
