import React, { Component } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

import ButtonCheckbox from './ButtonCheckbox.js';

import { accountLogin } from "oip-state/src/actions/Account/thunks";

const STATUS = {
	NO_INPUT: "NO_INPUT",
	VALID: "VALID",
	INVALID: "INVALID"
}

class LoginBlock extends Component {
	constructor(props){
		super(props);

		this.state = {
			User: {},
			emailState: STATUS.NO_INPUT,
			passwordState: STATUS.NO_INPUT,
			confirmState: STATUS.NO_INPUT,
			rememberMe: false,
			email: "",
			password: ""
		}

		this.login = this.login.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateRememberMe = this.updateRememberMe.bind(this);
	}

	login(){
	    this.props.accountLogin(this.state.email, this.state.password, { rememberMe: this.state.rememberMe })
    }

	updateEmail(){
		let newState;

		let isEmail = validator.isEmail(this.email.value);
		newState = isEmail ? STATUS.VALID : STATUS.INVALID;

		if (this.email.value === "")
			newState = STATUS.NO_INPUT;

		this.setState({email: this.email.value, emailState: newState});
	}

	updatePassword(){
		let newState = STATUS.VALID;

		if (this.password.value === "")
			newState = STATUS.NO_INPUT;

		this.setState({password: this.password.value, passwordState: newState});
	}

	updateRememberMe(){
		this.setState({rememberMe: !this.state.rememberMe });
	}

	render() {
		return (
			<div style={{width: "100%"}}>
                <h2>Please Login</h2>
				<hr className="" />
				<div className="form-group">
					<input ref={email => this.email = email} onInput={this.updateEmail} type="text" 
                           name="email" id="email" className={"form-control input-lg" + 
                           (this.state.emailState === STATUS.INVALID ? " is-invalid" : "") + 
                           (this.state.emailState === STATUS.VALID ? " is-valid" : "")} 
                           placeholder="Email/Identifier" 
                    />
                    
					{this.state.emailState === STATUS.INVALID ? 
						<div className="invalid-feedback" id="feedback_email">
							Email/Identifier is invalid. Please provide your identifier or your account Email.
						</div> 
						: 
						""
					}
				</div>
				<div className="form-group">
					<input  ref={password => this.password = password} onInput={this.updatePassword} 
                            type="password" className={"form-control input-lg" + 
                            (this.state.passwordState === STATUS.INVALID ? " is-invalid" : "") + 
                            (this.state.passwordState === STATUS.VALID ? " is-valid" : "")} 
                            placeholder="Password" 
                    />
                    {this.state.passwordState === STATUS.INVALID ? 
                    <div className="invalid-feedback" id="feedback_password">
                        Invalid Password.
                    </div> : ""
					}
				</div>
				<ButtonCheckbox onClick={this.updateRememberMe} toggleState={this.state.rememberMe} text={"Remember Me"} />
				<hr className="" />
				<div className="row">
					<div className="col-12 col-sm-5 col-md-5 order-2 order-sm-1">
						<button className="btn btn-lg btn-outline-secondary btn-block" 
                                onClick={this.props.onRegisterClick}>Register
                        </button>
					</div>
					<div className="col-12 col-sm-7 col-md-7 order-1 order-sm-2">
                       {this.props.Account.loginFailure ? this.props.Account.loginErrorMessage : null}
                        <button id="signinl" className={"btn btn-lg btn" + (this.props.Account.loginFailure ? "-danger" : "-success") + " btn-block"}
                                onClick={this.login}>{this.props.Account.loginFetching ? "Logging in..." : this.props.Account.loginFailure ? "Login Error" : "Login"}</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = {
    accountLogin
}

function mapStateToProps(state) {
    return {
        Account: state.Account,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock);