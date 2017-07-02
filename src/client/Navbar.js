import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import SaveButton from './SaveButton';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginBarOpen: false
    };
  }

  render() {
    const loginBarToggle = () => this.setState({loginBarOpen: !this.state.loginBarOpen});
    const collectionName = this.props.metadata.collectionName || 'New Inventory';
    let loginBar = null;
    if(this.state.loginBarOpen) {
      loginBar = <div className="login-bar">Great Scott!</div>;
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

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
