const React = require('react');

const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');

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
		<NaturalCritIcon />

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
