import React from 'react';

class LoginBar extends React.Component {
  render() {
    const { action, message, buttonText, cancel } = this.props;

    return (
      <div className="login-bar">
        <button onClick={() => cancel()} className="btn nav-button cancel">X</button>
        <h3 className="login-message">{message}</h3>
        <input className="input login-name" ref={(input) => this.name = input}/>
        <input type="password" className="input login-password" ref={(input) => this.password = input}/>
        <button onClick={() => action(this.name.value, this.password.value)} className="btn nav-button login">{buttonText}</button>
        <p className="login-subtitle">(Note: Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one of the following: "$@$!%?&")</p>
      </div>
    );
  }
}

export default LoginBar;
