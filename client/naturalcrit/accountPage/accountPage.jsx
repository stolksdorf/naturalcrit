import React from 'react';
const AccountActions = require('../account.actions.js');
const NaturalCritIcon = require('naturalcrit/svg/naturalcrit.svg.jsx');

const AccountPage = (props) => {
	return (
		<div className="accountPage">
			<a className='logo' href='/'>
				<NaturalCritIcon />
				<span className='name'>
					Natural
					<span className='crit'>Crit</span>
				</span>
			</a>
			<div className="details">
				<h1>Account Page</h1>
				<br />
				<p>
					<b>Username:</b> {props.user.username}
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
				<br />
				<br />
				<small>Upcoming features will include account deletion and username changes.</small>
			</div>
		</div>
	);
};

module.exports = AccountPage;
