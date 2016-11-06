const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');


const AccountActions = require('./account.actions.js');


const LoginPage = React.createClass({
	getDefaultProps: function() {
		return {
			redirect : '',
			user : null
		};
	},

	getInitialState: function() {
		return {
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

	handleUserChange : function(e){
		this.setState({
			usernameExists : true,
			username : e.target.value
		}, this.checkUsername);
	},
	handlePassChange : function(e){
		this.setState({ password : e.target.value });
	},
	handleLoginClick : function(){
		this.login();
	},
	redirect : function(){
		if(!this.props.redirect) return;
		this.setState({
			redirecting : true
		}, () => {window.location = this.props.redirect;});
	},


	login : function(){
		this.setState({
			processing : true,
			errors     : null
		});
		AccountActions.login(this.state.username, this.state.password)
			.then((token) => {
				this.setState({
					processing : false,
					errors : null,
					success : true
				}, this.redirect);
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					processing : false,
					errors : err
				});
			});
	},
	logout : function(){
		AccountActions.removeSession();
		window.location.reload();
	},

	signup : function(){
		this.setState({
			processing : true,
			errors     : null
		});
		AccountActions.signup(this.state.username, this.state.password)
			.then((token) => {
				this.setState({
					processing : false,
					errors : null,
					success : true
				}, this.redirect);
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					processing : false,
					errors : err
				});
			});
	},

	checkUsername : _.debounce(function(){
		this.setState({
			checkingUsername : true
		});
		AccountActions.checkUsername(this.state.username)
			.then((doesExist) => {
				this.setState({
					usernameExists : doesExist,
					checkingUsername : false
				});
			})
	}, 1000),

	renderProcessing : function(){
		if(!this.state.processing) return;

		return <div> processing</div>;
	},
	renderSuccess : function(){
		if(!this.state.success) return;
		return <div> success</div>
	},

	renderLoggedIn : function(){
		if(!this.props.user) return;

		return <div className='loggedin'>
			You are logged in as {this.props.user.username}

			<button onClick={this.logout}>logout</button>

		</div>

	},

	//Add detection for being logged in
	//Add a lil logout button

	render : function(){
		return <div className='loginPage'>
			<div className='content'>
				<h1>Login</h1>

				<label> username:</label>
				<input type='text' onChange={this.handleUserChange} value={this.state.username} />


				<label> password:</label>
				<input type='text' onChange={this.handlePassChange} value={this.state.password} />

				<button onClick={this.handleLoginClick}>login</button>
				<button onClick={this.signup}>signup</button>


				{this.renderProcessing()}
				{this.renderSuccess()}

				{this.renderLoggedIn()}

			</div>
		</div>
	}
});

module.exports = LoginPage;
