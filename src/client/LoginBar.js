import React from 'react';

class LoginBar extends React.Component {
  render() {
    const { action, message, buttonText, cancel } = this.props;

    return (
      <div className="login-bar">
        <button onClick={() => cancel()} className="nav-button cancel">X</button>
        <h3 className="login-message">{message}</h3>
        <input className="input login-name" ref={(input) => this.name = input}/>
        <input type="password" className="input login-password" ref={(input) => this.password = input}/>
        <button onClick={() => action(this.name.value, this.password.value)} className="nav-button login">{buttonText}</button>
      </div>
    );
  }
}

export default LoginBar;
