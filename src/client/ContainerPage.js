import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContainerRow from './ContainerRow';
import { addContainer, updateContainer, getContainers } from './reducers/inventory';

class ContainerPage extends React.Component {
  render() {
    const { containers, addContainer, updateContainer } = this.props;
    const containerRows = containers.map(container => {
      return (
        <ContainerRow key={`container-row-${container._id}`}
          container={container}
          updateContainer={updateContainer} />
      );
    });
    const addContainerButtonRow = <tr><td><button className="add-container" onClick={() => addContainer()}>Add Container</button></td></tr>;

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
  return bindActionCreators({ addContainer, updateContainer }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContainerPage);
