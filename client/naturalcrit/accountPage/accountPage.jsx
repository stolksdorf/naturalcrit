const React = require('react');
const AccountActions = require('../account.actions.js');
const NaturalCritIcon = require('naturalcrit/components/naturalcritLogo.jsx');
const AuthForm = require('../loginPage/authForm.jsx'); // Import AuthForm

class AccountPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showRenameForm: false,
			processing: false,
			errors: null,
		};
		this.handleRename = this.handleRename.bind(this); // Bind handleRename here
		this.toggleRenameForm = this.toggleRenameForm.bind(this); // Bind the method here
	}

	toggleRenameForm() {
		this.setState({ showRenameForm: !this.state.showRenameForm });
	}

	handleRename(newUsername, password) {
		const regex = /^(?!.*@).{3,}$/;

		if (!regex.test(newUsername)) {
			this.setState({
				processing: false,
				errors: { msg: 'Username must be at least 3 characters long and not include @!?.' },
			});
			return Promise.reject('Invalid username');
		}
		if (!confirm('Are you sure you want to rename your account?')) return Promise.reject('User canceled rename');

		this.setState({
			processing: true,
			errors: null,
		});

		return AccountActions.rename(this.props.user.username, newUsername, password)
			.then(() => {
				this.setState({
					processing: false,
					errors: null,
					showRenameForm: false,
				});
			})
			.catch((err) => {
				console.log(err);
				localStorage.setItem('errors', JSON.stringify(err)); // Store error in localStorage
				this.setState({
					processing: false,
					errors: err,
				});
				return Promise.reject(err);
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
					<button className="rename" onClick={this.toggleRenameForm}>
						{this.state.showRenameForm ? 'Cancel rename' : 'Change my username' }
					</button>
					<br />
					<br />
					{this.state.showRenameForm && <AuthForm actionType="rename" onSubmit={this.handleRename} />}
					<small>Upcoming features will include account deletion.</small>
				</div>
			</div>
		);
	}
}

module.exports = AccountPage;
