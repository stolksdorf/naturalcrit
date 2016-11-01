const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');
const request = require('superagent');


const LoginPage = React.createClass({
	getDefaultProps: function() {
		return {
			redirect : ''
		};
	},

	getInitialState: function() {
		return {
			username : '',
			password : '',

			processing : false,
			errors : null,
			success : false
		};
	},

	handleUserChange : function(e){
		this.setState({
			username : e.target.value
		});
	},
	handlePassChange : function(e){
		this.setState({
			password : e.target.value
		});
	},
	handleLoginClick : function(){
		this.login();
	},

	login : function(){
		this.setState({
			processing : true,
			errors: null
		});
		request.post('/login')
			.send({
				user : this.state.username,
				pass : this.state.password,
			})
			.end((err, res) => {
				this.setState({processing : false });
				if(err){
					console.log('EROR', err);
					return;
				}

				this.setState({
					processing : false,
					errors : null,
					success : true
				}, ()=> {
					if(this.props.redirect) window.location = this.props.redirect;
				})
			});
	},

	renderProcessing : function(){
		if(!this.state.processing) return;

		return <div> processing</div>;
	},
	renderSuccess : function(){
		if(!this.state.success) return;
		return <div> success</div>
	},

	render : function(){
		return <div className='loginPage'>
			<div className='content'>
				<h1>Login</h1>

				<label> username:</label>
				<input type='text' onChange={this.handleUserChange} value={this.state.username} />


				<label> password:</label>
				<input type='text' onChange={this.handlePassChange} value={this.state.password} />

				<button onClick={this.handleLoginClick}>login</button>

				{this.renderProcessing()}
				{this.renderSuccess()}

			</div>
		</div>
	}
});

module.exports = LoginPage;
