const React = require('react');
const cx = require('classnames');
const AccountActions = require('../account.actions.js');
const AuthForm = require('./authForm.jsx');
const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');

const RedirectLocation = 'NC-REDIRECT-URL';

const LoginPage = React.createClass({
	getDefaultProps: function () {
		return {
			redirect: '',
			user: null,
		};
	},
	getInitialState: function () {
		return {
			view: 'login', // or 'signup'
			redirecting: false,

		};
	},

	handleRedirectURL: function () {
		if (!this.props.redirect) {
			return window.sessionStorage.removeItem(RedirectLocation);
		}
		return window.sessionStorage.setItem(RedirectLocation, this.props.redirect);
	},

	redirect: function () {
		if (!this.props.redirect) return (window.location = '/');
		this.setState(
			{
				redirecting: true,
			},
			() => {
				window.location = this.props.redirect;
			}
		);
	},

	handleLoginSignup: function (username, password, view) {
		if (view === 'login') {
			return AccountActions.login(username, password)
				.then((token) => {
					this.setState({ redirecting: true }, this.redirect);
				})
				.catch((err) => {
					this.setState({})
					console.log(err);
					return Promise.reject(err);
				});
		} else if (view === 'signup') {
			return AccountActions.signup(username, password)
				.then((token) => {
					this.setState({ redirecting: true }, this.redirect);
				})
				.catch((err) => {
					console.log(err);
					return Promise.reject(err);
				});
		}
	},
	


	linkGoogle: function () {
		if (this.props.user) {
			if (
				!confirm(
					`You are currently logged in as ${this.props.user.username}. ` +
						`Do you want to link this user to a Google account? ` +
						`This will allow you to access the Homebrewery with your ` +
						`Google account and back up your files to Google Drive.`
				)
			)
				return;
		}

		this.setState({
			processing: true,
			errors: null,
		});
		window.location.href = '/auth/google';
	},

	handleChangeView: function (newView) {
		this.setState({
			view: newView,
		});
	},

	renderLoggedIn: function () {
		if (!this.props.user) return;
		if (!this.props.user.googleId) {
			return (
				<small>
					You are logged in as {this.props.user.username}.{' '}
					<a href="" onClick={this.logout}>
						logout.
					</a>
				</small>
			);
		} else {
			return (
				<small>
					You are logged in via Google as {this.props.user.username}.{' '}
					<a href="" onClick={this.logout}>
						logout.
					</a>
				</small>
			);
		}
	},

	render: function () {
		return (
			<div className="loginPage">
				<NaturalCritIcon />
				<div className="content">
					<div className="switchView">
						<div
							className={cx('login', { selected: this.state.view === 'login' })}
							onClick={this.handleChangeView.bind(null, 'login')}>
							<i className="fa fa-sign-in" /> Login
						</div>

						<div
							className={cx('signup', { selected: this.state.view === 'signup' })}
							onClick={this.handleChangeView.bind(null, 'signup')}>
							<i className="fa fa-user-plus" /> Signup
						</div>
					</div>
					<AuthForm actionType={this.state.view} onSubmit={this.handleLoginSignup} />
					<div className="divider">⎯⎯ OR ⎯⎯</div>
					<button className="google" onClick={this.linkGoogle}></button>
				</div>

				<br />
				<br />
				<br />
				<br />
				{this.renderLoggedIn()}
			</div>
		);
	},
});

module.exports = LoginPage;
