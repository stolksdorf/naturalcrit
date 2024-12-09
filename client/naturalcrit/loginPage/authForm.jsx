const React = require('react');
const cx = require('classnames');
const _ = require('lodash');
const AccountActions = require('../account.actions');

const AuthForm = React.createClass({
	getDefaultProps: function () {
		return {
			onSubmit: () => Promise.resolve(),
			user: null,
			actionType: 'login', // 'login', 'signup', or 'rename'
		};
	},

	getInitialState: function () {
		return {
			visible: false,
			username: this.props.user && this.props.user.username ? this.props.user.username : '',
			password: '',
			processing: false,
			checkingUsername: false,
			usernameExists: false,
			errors: null,
		};
	},

	componentDidMount: function () {
        console.log('mounting authform');
		window.document.addEventListener('keydown', this.handleKeyDown);
	},

	componentWillUnmount: function () {
		window.document.removeEventListener('keydown', this.handleKeyDown);
	},

	handleKeyDown: function (e) {
		if (e.code === 'Enter') this.handleSubmit();
	},

	handleInputChange: function (field) {
		return (e) => {
			this.setState({ [field]: e.target.value }, () => {
				if (field === 'username') this.checkUsername();
			});
		};
	},

    checkUsername: function () {
		if (this.state.username === '') return;

		this.setState({
			checkingUsername: true,
		});
		this.debounceCheckUsername(this.state.username);
	},

	debounceCheckUsername: _.debounce(function () {
		AccountActions.checkUsername(this.state.username).then((doesExist) => {
			this.setState({
				usernameExists: !!doesExist,
				checkingUsername: false,
			});
		});
	}, 1000),

	isValid: function () {
		const { username, password, usernameExists, processing } = this.state;
		const { actionType } = this.props;

		if (processing) return false;

		if (actionType === 'login') return username && password;
		if (actionType === 'signup' || actionType === 'rename') return username && password && !usernameExists;

		return false;
	},

	handleSubmit: function () {
		const { username, password } = this.state;
		const { actionType, onSubmit } = this.props;

		if (!this.isValid()) return;

		this.setState({ processing: true, errors: null });

		onSubmit(username, password, actionType)
			.then(() => this.setState({ processing: false, errors: null }))
			.catch((err) => {
                console.error(err);
				this.setState({
					processing: false,
					errors: err,
				});
			});
	},

	renderErrors: function () {
		const { errors } = this.state;
		if (!errors) return null;

		return <div className="errors">{errors.msg || 'Something went wrong'}</div>;
	},

	renderUsernameValidation: function () {
		const { checkingUsername, usernameExists, username } = this.state;
		if (!username) return null;

		let icon;
		if (checkingUsername) icon = <i className="fa fa-spinner fa-spin" />;
		else if (usernameExists) icon = <i className="fa fa-times red" />;
		else icon = <i className="fa fa-check green" />;

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
		} else if (this.props.actionType === 'login') {
			className = 'login';
			text = 'login';
			icon = 'fa-sign-in';
		} else if (this.props.actionType === 'signup') {
			className = 'signup';
			text = 'signup';
			icon = 'fa-user-plus';
		} else if (this.props.actionType === 'rename') {
			className = 'rename';
			text = 'rename';
			icon = 'fa-user-plus';
		}

		return (
			<button className={cx('action', className)} disabled={!this.isValid()} onClick={this.handleSubmit}>
				<i className={`fa ${icon}`} />
				{text}
			</button>
		);
	},

	render: function () {
		const { actionType } = this.props;
		const { visible, username, password, processing } = this.state;

		let buttonText;
		if (processing) buttonText = 'Processing...';
		else if (actionType === 'login') buttonText = 'Login';
		else if (actionType === 'signup') buttonText = 'Signup';
		else buttonText = 'Rename';

		return (
			<div className={`authForm ${actionType}`}>
				<label className="field user">
					Username
					<input type="text" onChange={this.handleInputChange('username')} value={username} />
					{this.props.actionType !== 'login' && this.renderUsernameValidation()}
				</label>

				<label className="field password">
					Password
					<input
						type={cx({ text: visible, password: !visible })}
						onChange={this.handleInputChange('password')}
						value={password}
					/>
					<div className="control" onClick={() => this.setState({ visible: !visible })}>
						<i className={cx('fa', { 'fa-eye': !visible, 'fa-eye-slash': visible })} />
					</div>
				</label>

				{this.renderErrors()}
				{this.renderButton()}
			</div>
		);
	},
});

module.exports = AuthForm;
