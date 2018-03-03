import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { fetchAllItems } from './reducers/inventory';
import { getCredentials } from './CredentialProvider';
import MainCalculator from './MainCalculator';
import ContainerPage from './ContainerPage';

export class App extends React.Component {
  componentDidMount() {
    const token = getCredentials();
    if(token) {
      this.props.fetchAllItems();
    }
  }

  render() {
    return (
      <div>
        <Route exact path="/" component={MainCalculator} />
        <Route exact path="/containers" component={ContainerPage} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchAllItems }, dispatch);
};

export default connect(() => ({}), mapDispatchToProps)(App);
