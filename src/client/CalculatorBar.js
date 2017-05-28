import React from 'react';
import { connect } from 'react-redux';
import { getContainers } from './reducers/inventory';

class CalculatorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calculatorRows: []
    };
  }

  render() {
    const { name, updateWeight, containers } = this.props;
    const options = containers.map(container => {
      return (
        <option value={container.weight}>{container.name}</option>
      );
    });

    return(
      <div>
        <h3>{`Calculate Weight for: ${name}`}</h3>
        <select>
          {options}
        </select>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    containers: getContainers(state)
  };
};

export default connect(mapStateToProps)(CalculatorBar);
