const React = require('react');
const _ = require('lodash');
const cx = require('classnames');

const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');
const AccountActions = require('../account.actions.js');

const RedirectLocation = 'NC-REDIRECT-URL';

const LoginForm = React.createClass({
	getDefaultProps: function () {
		return {
			user: null,
			renaming: null,
			onRenameSuccess: () => {},
		};
	},
	getInitialState: function () {
		return {
			visible: false,

			username: '',
			newUsername: '',
			password: '',

			errors: null,
			success: false,
		};
	},
	componentDidMount: function () {
		window.document.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') this.login();
		});
	},

	componentWillUnmount: function () {
		window.document.removeEventListener('keydown', this.handleKeyPress);
	},

	handleUserChange: function (e) {
		this.setState({ username: e.target.value });
	},
	handleNewUserChange: function (e) {
		this.setState({ username:this.props.user.username, newUsername: e.target.value });
	},

	handlePassChange: function (e) {
		this.setState({ password: e.target.value });
	},

	login: function () {
		this.setState({
			processing: true,
			errors: null,
		});
		AccountActions.login(this.state.username, this.state.password)
			.then((token) => {
				this.setState({
					processing: false,
					errors: null,
					success: true,
				});
				if (this.props.renaming && this.state.newUsername) {
					AccountActions.rename(this.state.username, this.state.newUsername)
						.then((res) => {
							this.props.onRenameSuccess(this.state.newUsername, this.state.password);
						})
						.catch((err) => {
							console.log(err);
							this.setState({
								processing: false,
								errors: err,
							});
						});
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					processing: false,
					errors: err,
				});
			});
	},

	renderErrors: function () {
		if (!this.state.errors) return;
		if (this.state.errors.msg) return <div className="errors">{this.state.errors.msg}</div>;
		return <div className="errors">Something went wrong</div>;
	},

	renderButton: function () {
		return (
			<button
				className="action login"
				disabled={
					!this.state.username || !this.state.password || !(this.props.user && this.props.user.username)
				}
				onClick={this.login}>
				<i className="fa fa-sign-in" />
				login
			</button>
		);
	},

	render: function () {
		return (
			<div className="authForm">
				{!this.props.renaming ? (
					<label className="field user">
						username
						<input type="text" onChange={this.handleUserChange} value={this.state.username} />
					</label>
				) : (
					<label className="field user">
						new username
						<input type="text" onChange={this.handleNewUserChange} value={this.state.newUsername} />
					</label>
				)}

				<label className="field password">
					password
					<input
						type={cx({ text: this.state.visible, password: !this.state.visible })}
						onChange={this.handlePassChange}
						value={this.state.password}
					/>
					<div
						className="control"
						onClick={() => {
							this.setState({ visible: !this.state.visible });
						}}>
						<i
							className={cx('fa', {
								'fa-eye': !this.state.visible,
								'fa-eye-slash': this.state.visible,
							})}
						/>
					</div>
				</label>
				{this.renderErrors()}
				{this.renderButton()}
			</div>
		);
	},
});

module.exports = LoginForm;
