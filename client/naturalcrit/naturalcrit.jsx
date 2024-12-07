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
		};
	},

	componentWillMount: function () {
		global.domain = this.props.domain;

		Router = CreateRouter({
			'/account': (args, query) => {
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

	render: function () {
		console.log(this.props);
		const isLocal = this.props.domain === ".local.naturalcrit.com";
		return (
			<div className="naturalcrit">
				<Router initialUrl={this.props.url} />
				<div className={`accountButton ${this.props.user ? '' : 'login'}`}>{this.renderAccount()}</div>
				<div class="environment"></div>
			</div>
		);
	},
});

module.exports = Naturalcrit;
