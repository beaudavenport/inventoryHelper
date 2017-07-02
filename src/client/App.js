import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllItems } from './reducers/inventory';
import { getCredentials } from './CredentialProvider';

export class App extends React.Component {
  componentDidMount() {
    const token = getCredentials();
    if(token) {
      this.props.fetchAllItems();
    }
  }

  render() {
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchAllItems }, dispatch);
};

export default connect(() => ({}), mapDispatchToProps)(App);
