import React from 'react';

class LoginBar extends React.Component {
  render() {
    const {login} = this.props;

    return (
      <div>
        <input className="login-name" ref={(input) => this.name = input}/>
        <input type="password" className="login-password" ref={(input) => this.password = input}/>
        <button onClick={() => login(this.name.value, this.password.value)} className="btn login">Login</button>
      </div>
    );
  }
}

export default LoginBar;
