const React = require('react');

const CreateRouter = require('pico-router').createRouter;

//Pages
const HomePage = require('./homePage/homePage.jsx');
const AccountPage = require('./accountPage/accountPage.jsx');
const LoginPage = require('./loginPage/loginPage.jsx');
const SuccessPage = require('./successPage/successPage.jsx');
const GoogleRedirect = require('./googleRedirect/googleRedirect.jsx');

let Router;
const Naturalcrit = React.createClass({
	getDefaultProps: function () {
		return {
			user: null,
			url: '',
			domain: '',
			authToken: '',
			environment: '',
		};
	},

	componentWillMount: function () {
		global.domain = this.props.domain;

		Router = CreateRouter({
			'/account': (args, query) => {
				if (!this.props.user || !this.props.user.username) {
					return <LoginPage redirect={this.props.url} user={this.props.user} />;
				}
				return <AccountPage user={this.props.user} />;
			},
			'/login': (args, query) => {
				return <LoginPage redirect={query.redirect} user={this.props.user} />;
			},
			'/success': (args, query) => {
				return <SuccessPage user={this.props.user} />;
			},
			'/auth/google/redirect': (args, query) => {
				return <GoogleRedirect user={this.props.user} />;
			},
			'*': () => {
				return <HomePage configTools={this.props.tools} user={this.props.user} />;
			},
		});
	},

	renderAccount: function () {
		let accountLink = '';
		if (this.props.user && this.props.user.username) {
			accountLink = <a href="/account">{this.props.user.username}</a>;
		} else {
			accountLink = <a href="/login">Log in</a>;
		}
		return accountLink;
	},

	renderEnviroment: function () {
		const env = this.props.environment;
		if (env[0] === 'production' && !env[1]) return; // Live site
		if (env[0] === 'production' && env[1]) return <div className="environment">PR - {env[1]}</div>; // PR
		return <div className="environment">Local</div>; // Local
	},

	render: function () {
		return (
			<div className="naturalcrit">
				<Router initialUrl={this.props.url} />
				<div className={`accountButton ${this.props.user ? '' : 'login'}`}>{this.renderAccount()}</div>
				{this.renderEnviroment()}
			</div>
		);
	},
});

module.exports = Naturalcrit;
