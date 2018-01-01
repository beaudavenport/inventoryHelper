import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sync } from './reducers/metadata';

class SaveButton extends React.Component {
  render() {
    const { metadata, sync } = this.props;

    if(metadata.lastSync != undefined) {
      const callToSave = () => sync();
      const lastSyncFormatted = new Date(metadata.lastSync).toLocaleString();
      return (
        <div className="save-button">
          <button className="btn nav-button" onClick={callToSave}><i className="fa fa-floppy-o"></i> SAVE</button>
          <p className="last-save">Last save: {lastSyncFormatted}</p>
        </div>
      );
    } else {
      return (
        <div className="save-button">
          <button disabled={true} className="btn nav-button"><i className="fa fa-floppy-o"></i> SAVE</button>
          <p className="last-save">Sign in to Save</p>
        </div>
      );
    }
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
