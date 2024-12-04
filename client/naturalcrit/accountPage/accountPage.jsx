import React from 'react';

const AccountPage = (props) => {
	console.log(props);

	return <div className="accountPage">
        <div className="details">
            <h1>Account Page</h1>
            <br />
            <p>Username: {props.user.username}</p>

            <button className="logout" onClick={()=>{
                if(confirm('Are you sure you want to log out?')) {
                    document.cookie = `nc_session=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`
                    window.location = '/';
                }
            }}>Log Out</button>

        </div>

    </div>;
};

module.exports = AccountPage;
