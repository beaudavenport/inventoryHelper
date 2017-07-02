import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from './reducers/inventory';
import { Link } from 'react-router-dom';
import SaveButton from './SaveButton';
import LoginBar from './LoginBar';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginBarOpen: false
    };
  }

  render() {
    const { loginBarOpen } = this.state;
    const { login } = this.props;

    const loginBarToggle = () => this.setState({loginBarOpen: !loginBarOpen});
    const collectionName = this.props.metadata.collectionName || 'New Inventory';
    const loginBar = loginBarOpen ? <LoginBar login={login}/> : null;

    return (
      <div>
        <nav className="navbar navbar-inverse bg-inverse">
          <Link className="navbar-brand" to="/">
            Inventory Helper: <span className="collection-name">{collectionName}</span>
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item"><Link to="/containers" className="nav-link">Containers</Link></li>
            <li className="nav-item"><SaveButton /></li>
            <li className="nav-item"><button className="login-toggle" onClick={loginBarToggle}>Login Pane</button></li>
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
  return bindActionCreators({login}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
