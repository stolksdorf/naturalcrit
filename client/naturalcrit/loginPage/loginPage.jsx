const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');

const NaturalCritIcon = require('naturalcrit/svg/naturalcrit.svg.jsx');
const AccountActions = require('../account.actions.js');


const LoginPage = React.createClass({
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
		window.document.onkeypress = (e)=>{
			if(e.code == 'Enter') this.handleClick();
		}
	},


	handleUserChange : function(e){
		this.setState({
			usernameExists : true,
			checkingUsername : true,
			username : e.target.value
		}, ()=>{ if(this.state.view==='signup') this.checkUsername(); });
	},
	handlePassChange : function(e){
		this.setState({ password : e.target.value });
	},
	handleClick : function(){
		if(!this.isValid()) return;
		if(this.state.view === 'login') this.login();
		if(this.state.view === 'signup') this.signup();
	},

	redirect : function(){
		if(!this.props.redirect) return window.location.reload();
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
	logout : function(e){
		e.preventDefault();
		AccountActions.removeSession();
		window.location.reload();
		return false;
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

	checkUsername : function(){
		if(this.state.username === '') return;
		this.setState({
			checkingUsername : true
		});
		this.debounceCheckUsername();
	},

	debounceCheckUsername : _.debounce(function(){
		AccountActions.checkUsername(this.state.username)
			.then((doesExist) => {
				this.setState({
					usernameExists : !!doesExist,
					checkingUsername : false
				});
			})
	}, 1000),

	handleChangeView : function(newView){
		this.setState({
			view : newView,
			errors : null
		},this.checkUsername);
	},

	isValid : function(){
		if(this.state.processing) return false;

		if(this.state.view === 'login'){
			return this.state.username && this.state.password;
		}else if(this.state.view === 'signup'){
			return this.state.username && this.state.password && !this.state.usernameExists;
		}
	},

	linkGoogle : function(){
		if(this.props.user) {
			if(!confirm(`You are currently logged in as ${this.props.user.username}. ` +
									`Do you want to link this user to a Google account? ` +
									`This will allow you to access the Homebrewery with your ` +
									`Google account and back up your files to Google Drive.`))
				return;
		}

		this.setState({
			processing : true,
			errors     : null
		});
		window.location.href='/auth/google';
	},

	// loginGoogle : function(){
	// 	this.setState({
	// 		processing : true,
	// 		errors     : null
	// 	});
	// 	console.log("about to log into google!");
	// 	AccountActions.loginGoogle();
	// },


	// 	console.log("about to start login");
	// 	AccountActions.login(this.state.username, this.state.password)
	// 		.then((token) => {
	// 			this.setState({
	// 				processing : false,
	// 				errors : null,
	// 				success : true
	// 			}, this.redirect);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			this.setState({
	// 				processing : false,
	// 				errors : err
	// 			});
	// 		});
	// },

	renderErrors : function(){
		if(!this.state.errors) return;
		if(this.state.errors.msg) return <div className='errors'>{this.state.errors.msg}</div>;
		return <div className='errors'>Something went wrong</div>;
	},

	renderUsernameValidation : function(){
		if(this.state.view === 'login') return;

		let icon = null;

		if(this.state.checkingUsername){
			icon = <i className='fa fa-spinner fa-spin' />;
		}else if(!this.state.username || this.state.usernameExists){
			icon = <i className='fa fa-times red' />;
		}else if(!this.state.usernameExists){
			icon = <i className='fa fa-check green' />
		}

		return <div className='control'>{icon}</div>
	},

	renderButton : function(){
		let className = '';
		let text = '';
		let icon = '';

		if(this.state.processing){
			className = 'processing';
			text = 'processing';
			icon = 'fa-spinner fa-spin';
		}else if(this.state.view === 'login'){
			className = 'login';
			text = 'login';
			icon = 'fa-sign-in';
		}else if(this.state.view === 'signup'){
			className = 'signup';
			text = 'signup';
			icon = 'fa-user-plus';
		}

		return <button
			className={cx('action', className)}
			disabled={!this.isValid()}
			onClick={this.handleClick}>
			<i className={`fa ${icon}`} />
			{text}
		</button>
	},

	renderLoggedIn : function(){
		if(!this.props.user) return;
		let loggedInGoogle = "";
    if (!this.props.user.googleId) {
      return <div className='loggedin'>
				You are logged in as {this.props.user.username}. <a href='' onClick={this.logout}>logout.</a>
			</div>
    }
		else {
			return <div className='loggedin'>
				You are logged in via Google as {this.props.user.username}. <a href='' onClick={this.logout}>logout.</a>
			</div>
		}
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
				<div className='switchView'>
					<div className={cx('login', {'selected' : this.state.view === 'login'})}
						onClick={this.handleChangeView.bind(null, 'login')}>
						<i className='fa fa-sign-in' /> Login
					</div>

					<div className={cx('signup', {'selected' : this.state.view === 'signup'})}
						onClick={this.handleChangeView.bind(null, 'signup')}>
						<i className='fa fa-user-plus' /> Signup
					</div>

				</div>


				<div className='field user'>
					<label>username</label>
					<input
						type='text'
						onChange={this.handleUserChange}
						value={this.state.username} />
					{this.renderUsernameValidation()}
					{this.state.usernameExists && !this.state.checkingUsername && this.state.view==='signup' ? <div className='userExists'>User with that name already exists</div> : null}
				</div>

				<div className='field password'>
					<label>password</label>
					<input
						type={cx({text : this.state.visible, password : !this.state.visible})}
						onChange={this.handlePassChange}
						value={this.state.password} />

					<div className='control' onClick={()=>{this.setState({visible : !this.state.visible})}}>
						<i className={cx('fa', {'fa-eye' : !this.state.visible, 'fa-eye-slash' : this.state.visible})} />
					</div>
				</div>
				{this.renderErrors()}
				{this.renderButton()}
				<div className='divider'>⎯⎯ OR ⎯⎯</div>
				<button	className='google' onClick={this.linkGoogle}></button>
			</div>
			{this.renderLoggedIn()}
		</div>
	}
});

module.exports = LoginPage;
