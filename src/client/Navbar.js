import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, createNew, logout } from './reducers/inventory';
import { Link } from 'react-router-dom';
import SaveButton from './SaveButton';
import LoginBar from './LoginBar';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginBarChoice: null
    };
  }

  render() {
    const { loginBarChoice } = this.state;
    const { login, createNew, logout } = this.props;

    const loginToggle = () => this.setState({loginBarChoice: 'login'});
    const createToggle = () => this.setState({loginBarChoice: 'create'});
    const collectionName = this.props.metadata.collectionName || 'New Inventory';

    let loginBar = null;
    if(loginBarChoice === 'login') {
      loginBar = <LoginBar action={login} message='Login' buttonText="Login"/>;
    } else if (loginBarChoice === 'create') {
      loginBar = <LoginBar action={createNew} message='Create new inventory' buttonText="Create"/>;
    }
    const loginBarContainerClass = loginBar ? 'login-bar-container-filled' : 'login-bar-container';
    // <button><i className="fa fa-caret-down" aria-hidden="true"></i></button>

    return (
      <div>
        <nav className="">
          <div className="navbar">
            <Link className="header" to="/">
              Inventory Helper
            </Link>
            <div className="collection-bar">
              <span className="collection-name">{collectionName}</span>
              <button className="login-toggle nav-button" onClick={loginToggle}>Login</button>
              <button className="create-toggle nav-button" onClick={createToggle}>Create</button>
              <button className="logout nav-button" onClick={logout}>Logout</button>
            </div>
          </div>
          <div className={loginBarContainerClass}>
            {loginBar}
          </div>
          <div className="container card">
            <ul>
              <li><Link to="/containers" className="nav-link">Containers</Link></li>
              <li><SaveButton /></li>
              <li><button className="login-toggle" onClick={loginToggle}>Login</button></li>
              <li><button className="create-toggle" onClick={createToggle}>Create</button></li>
              <li><button className="logout" onClick={logout}>Logout</button></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    metadata: state.metadata
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({login, createNew, logout}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
