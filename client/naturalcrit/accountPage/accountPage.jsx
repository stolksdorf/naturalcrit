import React from 'react';
const AccountActions = require('../account.actions.js');

const AccountPage = (props) => {
	console.log(props);

	return <div className="accountPage">
        <div className="details">
            <h1>Account Page</h1>
            <br />
            <p>Username: {props.user.username}</p>

            <button className="logout" onClick={()=>{
                if(confirm('Are you sure you want to log out?')) {
                    AccountActions.removeSession();
                    window.location = '/';
                }
            }}>Log Out</button>
        </div>
    </div>;
};

module.exports = AccountPage;
