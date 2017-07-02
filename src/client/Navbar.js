import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, createNew } from './reducers/inventory';
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
    const { login, createNew } = this.props;

    const loginToggle = () => this.setState({loginBarChoice: 'login'});
    const createToggle = () => this.setState({loginBarChoice: 'create'});
    const collectionName = this.props.metadata.collectionName || 'New Inventory';

    let loginBar = null;
    if(loginBarChoice === 'login') {
      loginBar = <LoginBar action={login} message='Login' buttonText="Login"/>;
    } else if (loginBarChoice === 'create') {
      loginBar = <LoginBar action={createNew} message='Create new inventory' buttonText="Create"/>;
    }

    return (
      <div>
        <nav className="navbar navbar-inverse bg-inverse">
          <Link className="navbar-brand" to="/">
            Inventory Helper: <span className="collection-name">{collectionName}</span>
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item"><Link to="/containers" className="nav-link">Containers</Link></li>
            <li className="nav-item"><SaveButton /></li>
            <li className="nav-item"><button className="login-toggle" onClick={loginToggle}>Login</button></li>
            <li className="nav-item"><button className="create-toggle" onClick={createToggle}>Create</button></li>
          </ul>
        </nav>
        {loginBar}
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
  return bindActionCreators({login, createNew}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
