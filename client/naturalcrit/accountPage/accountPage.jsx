const React = require('react');
const AccountActions = require('../account.actions.js');
const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');
const RenameForm = require('../loginPage/renameForm.jsx');

class AccountPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showLogin: false
		};
		this.toggleLogin = this.toggleLogin.bind(this);
		this.handleRenameSuccess = this.handleRenameSuccess.bind(this); // Bind method
	}

	toggleLogin() {
		this.setState({ showLogin: !this.state.showLogin });
	}

	handleRenameSuccess(newUsername, password) {
		console.log('handling rename, ', newUsername, password);
		AccountActions.removeSession();
	
		AccountActions.login(newUsername, password).then(() => {
			this.setState({ showLogin: false });
			window.location.reload();
		}).catch(error => {
			console.error('Login failed', error);
		});
	}

	render() {
		return (
			<div className="accountPage">
				<NaturalCritIcon />
				<div className="details">
					<h1>Account Page</h1>
					<br />
					<p>
						<b>Username:</b> {this.props.user.username}
						<br />
					</p>
					<br />
					<button
						className="logout"
						onClick={() => {
							if (confirm('Are you sure you want to log out?')) {
								AccountActions.removeSession();
								window.location = '/';
							}
						}}>
						Log Out
					</button>
					<button className="rename" onClick={this.toggleLogin}>
						Change my username
					</button>
					<br />
					<br />
					{this.state.showLogin && (
						<RenameForm 
							user={this.props.user} 
							onRenameSuccess={this.handleRenameSuccess}
						/>
					)}
					<small>Upcoming features will include account deletion and username changes.</small>
				</div>
			</div>
		);
	}
}

module.exports = AccountPage;
