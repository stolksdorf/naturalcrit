import React from 'react';
const AccountActions = require('../account.actions.js');

const AccountPage = (props) => {
	return (
		<div className="accountPage">
			<div className="details">
				<h1>Account Page</h1>
				<br />
				<p>Username: {props.user.username}</p>

				<button className="red delete" disabled>
					Delete account
				</button>
				<button className="orange changeUsername" disabled>
					Change my username
				</button>
			</div>
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
		</div>
	);
};

module.exports = AccountPage;
