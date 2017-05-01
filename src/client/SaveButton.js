import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sync } from './reducers/lastSync';

class SaveButton extends React.Component {
  render() {
    const { lastSync, sync } = this.props;
    const callToSave = () => sync();

    return (
      <button onClick={callToSave}>{lastSync.lastSync}</button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lastSync: state.lastSync
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ sync }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveButton);
