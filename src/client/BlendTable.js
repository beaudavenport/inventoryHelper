import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addBlend, updateBlend, getBlends, flagForDeletion } from './reducers/inventory';
import BlendRow from './BlendRow';

class BlendTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRow: null
    };
  }

  render() {
    const { addBlend, updateBlend, flagForDeletion, blends } = this.props;
    const { activeRow } = this.state;

    const setActiveRow = (id) => this.setState({activeRow: id});
    const resetActiveRow = () => this.setState({activeRow: null});
    const blendRows = blends.map((blend) => {
      if(blend._id === activeRow) {
        return (<BlendRow key={`blend-row-${blend._id}`}
          blend={blend}
          updateBlend={updateBlend}
          flagForDeletion={flagForDeletion}
          closeActiveRow={resetActiveRow}
        />);
      }
      return (<tr className="inactive-row" key={`blend-tr-${blend._id}`} onClick={() => setActiveRow(blend._id)}>
          <td>{`${blend.name}, ${blend.origin}`}</td>
          <td>{parseFloat(blend.weight).toFixed(2)}</td>
          <td>{parseFloat(blend.weight).toFixed(2)}</td>
          </tr>);
    });

    const addBlendButtonRow = <tr><td colSpan="3"><button className="btn table-button add-blend" onClick={() => addBlend()}><i className="fa fa-plus"></i> Add Blend</button></td></tr>;
    const totalWeight = blends.reduce((acc, blend) => acc + blend.weight, 0);

    return (
      <div className="card">
        <h2>Blends</h2>
        <table className="table">
          <thead>
            <tr>
              <td>Blend</td>
              <td>Weight</td>
              <td>Total</td>
            </tr>
            </thead>
            <tbody>
              {blendRows}
              {addBlendButtonRow}
              <tr>
                <td>Total Weights:</td>
                <td>{parseFloat(totalWeight).toFixed(2)}</td>
                <td className="total-blend-weight">{parseFloat(totalWeight).toFixed(2)}</td>
              </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    blends: getBlends(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addBlend, updateBlend, flagForDeletion }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BlendTable);
