const React = require('react');
const _ = require('lodash');
const cx = require('classnames');

const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');
const AccountActions = require('../account.actions.js');

const RedirectLocation = 'NC-REDIRECT-URL';

const RenameForm = React.createClass({
	getDefaultProps: function () {
		return {
			user: null,
			onRenameSuccess: () => {},
		};
	},
	getInitialState: function () {
		return {
			visible: false,

			newUsername: '',
			password: '',

			processing: false,
			checkingUsername: false,
			redirecting: false,

			usernameExists: false,
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
		this.setState(
			{
				usernameExists: true,
				checkingUsername: true,
			},
			() => {
				if (this.state.view === 'signup') this.checkUsername();
			}
		);
	},

	handleNewUserChange: function (e) {
		this.setState({ username: this.props.user.username, newUsername: e.target.value });
		this.setState({
			usernameExists: true,
			checkingUsername: true,
		});
		this.checkUsername();
	},

	handlePassChange: function (e) {
		this.setState({ password: e.target.value });
	},

	login: function () {
		if (!confirm('Are you sure you want to rename your account?')) return;
		this.setState({
			processing: true,
			errors: null,
		});
		AccountActions.login(this.props.username, this.state.password)
			.then((token) => {
				this.setState({
					processing: false,
					errors: null,
					success: true,
				});
				//check if username exists

				if (this.state.newUsername) {
					AccountActions.rename(this.props.user.username, this.state.newUsername)
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

	checkUsername: function () {
		if (this.state.newUsername === '') return;
		const regex = /^(?!.*@).{3,}$/;

		if (!regex.test(this.state.newUsername)) {
			this.setState({
				processing: false,
				errors: { username: 'Username must be at least 3 characters long.' },
			});
			return;
		}
		this.setState({
			checkingUsername: true,
		});
		this.debounceCheckUsername(this.state.newUsername);
	},

	debounceCheckUsername: _.debounce(function () {
		AccountActions.checkUsername(this.state.newUsername).then((doesExist) => {
			this.setState({
				usernameExists: !!doesExist,
				checkingUsername: false,
			});
		});
	}, 1000),

	isValid: function () {
		console.log(
			this.state.processing,
			'should be false, ',
			this.state.newUsername,
			' must be over 3 characters and not exist, does it exist? ',
			this.state.usernameExists,
			'and there must be a password, is there? ',
			this.state.password
		);
		if (this.state.processing) return false;
		return this.state.newUsername && this.state.password && !this.state.usernameExists;
	},

	renderErrors: function () {
		if (!this.state.errors) return;
		if (this.state.errors.msg) return <div className="errors">{this.state.errors.msg}</div>;
		return <div className="errors">Something went wrong</div>;
	},

	renderUsernameValidation: function () {
		let icon = null;

		if (this.state.checkingUsername) {
			icon = <i className="fa fa-spinner fa-spin" />;
		} else if (!this.state.newUsername || this.state.usernameExists) {
			icon = <i className="fa fa-times red" />;
		} else if (!this.state.usernameExists) {
			icon = <i className="fa fa-check green" />;
		}

		return <div className="control">{icon}</div>;
	},

	renderButton: function () {
		let className = '';
		let text = '';
		let icon = '';

		if (this.state.processing) {
			className = 'processing';
			text = 'processing';
			icon = 'fa-spinner fa-spin';
		} else {
			className = 'signup';
			text = 'Rename';
			icon = 'fa-user-plus';
		}

		return (
			<button
				className={cx('action', className)}
				disabled={!this.isValid()}
				onClick={this.login}>
				<i className={`fa ${icon}`} />
				{text}
			</button>
		);
	},

	render: function () {
		return (
			<div className="authForm">
				<label className="field user">
					new username
					<input type="text" onChange={this.handleNewUserChange} value={this.state.newUsername} />
					{this.renderUsernameValidation()}
					{this.state.usernameExists && !this.state.checkingUsername ? (
						<div className="userExists">User with that name already exists</div>
					) : null}
				</label>

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

module.exports = RenameForm;
