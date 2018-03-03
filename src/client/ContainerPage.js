import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContainerRow from './ContainerRow';
import { addContainer, updateContainer, getContainers, flagForDeletion } from './reducers/inventory';

class ContainerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRow: null
    };
  }

  render() {
    const { containers, addContainer, updateContainer, flagForDeletion } = this.props;
    const { activeRow } = this.state;

    const setActiveRow = (id) => this.setState({activeRow: id});
    const resetActiveRow = () => this.setState({activeRow: null});
    const containerRows = containers.map(container => {
      if(container._id === activeRow) {
        return (
          <ContainerRow key={`container-row-${container._id}`}
            container={container}
            updateContainer={updateContainer}
            flagForDeletion={flagForDeletion}
            closeActiveRow={resetActiveRow} />
        );
      }
      return (<tr className="inactive-row" key={`container-tr-${container._id}`} onClick={() => setActiveRow(container._id)}>
          <td>{container.name}</td>
          <td>{parseFloat(container.weight).toFixed(2)}</td>
          </tr>);
    });
    const addContainerButtonRow = <tr><td colSpan="2"><button className="btn table-button add-container" onClick={() => addContainer()}><i className="fa fa-plus"></i> Add Container</button></td></tr>;

    return (
      <div className="card">
        <h2>Edit Containers</h2>
        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Tare Weight</td>
            </tr>
          </thead>
          <tbody>
            {containerRows}
            {addContainerButtonRow}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    containers: getContainers(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addContainer, updateContainer, flagForDeletion }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContainerPage);
