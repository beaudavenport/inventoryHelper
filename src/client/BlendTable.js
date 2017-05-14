import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addBlend, updateBlend, getBlends } from './reducers/inventory';
import BlendRow from './BlendRow';

class BlendTable extends React.Component {
  render() {
    const { addBlend, updateBlend, blends } = this.props;
    const blendRows = blends.map((blend, index) => {
      return (<BlendRow key={`blend-row-${index}`}
        blend={blend}
        updateBlend={updateBlend}
      />);
    });
    const addBlendButtonRow = <tr><td><button className="add-blend" onClick={() => addBlend()}>Add Blend</button></td></tr>;

    return (
      <table className="table">
        <thead>
          <tr>
            <td>Blend</td>
            <td>Weight</td>
          </tr>
          {blendRows}
          {addBlendButtonRow}
        </thead>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    blends: getBlends(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addBlend, updateBlend }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BlendTable);
