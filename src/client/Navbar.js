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

  componentWillReceiveProps() {
    this.setState({loginBarChoice: null});
  }

  render() {
    const { loginBarChoice } = this.state;
    const { login, createNew, logout, metadata } = this.props;

    const cancel = () => this.setState({loginBarChoice: null});
    const loginToggle = () => this.setState({loginBarChoice: 'login'});
    const createToggle = () => this.setState({loginBarChoice: 'create'});
    const collectionName = metadata.collectionName || 'New Inventory';

    let loginBar = null;
    let navButtons = null;

    if(metadata.lastSync === undefined) {
      navButtons = (<div className="collection-bar">
        <button className="login-toggle btn nav-button" onClick={loginToggle}>Login</button>
        <button className="create-toggle btn nav-button" onClick={createToggle}>Create</button>
      </div>);
    } else {
      navButtons = (<div className="collection-bar">
        <button className="logout btn nav-button" onClick={logout}>Logout</button>
      </div>);
    }

    if(loginBarChoice === 'login') {
      loginBar = <LoginBar cancel={cancel} action={login} message='Login' buttonText="Login"/>;
    } else if (loginBarChoice === 'create') {
      loginBar = <LoginBar cancel={cancel} action={createNew} message='Create new inventory' buttonText="Create"/>;
    }
    const loginBarContainerClass = loginBar ? 'login-bar-container-filled' : 'login-bar-container';

    return (
      <div>
        <nav className="">
          <div className="navbar">
            <Link className="header" to="/">
              Inventory Helper
            </Link>
            {navButtons}
          </div>
          <div className={loginBarContainerClass}>
            {loginBar}
          </div>
          <div className="navbar collection">
            <span className="collection-name">{collectionName}</span>
            <Link to="/" className="nav-link ">Home</Link>
            <Link to="/containers" className="nav-link">Edit Containers</Link>
            <SaveButton />
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
