import React from 'react';

class LoginBar extends React.Component {
  render() {
    const { action, message, buttonText } = this.props;

    return (
      <div>
        <h3 className="login-message">{message}</h3>
        <input className="login-name" ref={(input) => this.name = input}/>
        <input type="password" className="login-password" ref={(input) => this.password = input}/>
        <button onClick={() => action(this.name.value, this.password.value)} className="btn login">{buttonText}</button>
      </div>
    );
  }
}

export default LoginBar;
