import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sync } from './reducers/metadata';

class SaveButton extends React.Component {
  render() {
    const { metadata, sync } = this.props;
    const callToSave = () => sync();

    return (
      <button className="btn nav-button" onClick={callToSave}>SAVE <span>last save: {metadata.lastSync}</span></button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    metadata: state.metadata
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ sync }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveButton);
