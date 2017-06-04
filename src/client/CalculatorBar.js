import React from 'react';
import { connect } from 'react-redux';
import { getContainers } from './reducers/inventory';
import CalculatorRow from './CalculatorRow';
import Guid from 'guid';

function createEmptyCalcRow() {
  return {id: Guid.raw(), weight: 0, tare: 0};
}

export class CalculatorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      [props.type]: [createEmptyCalcRow()]
    };
  }

  componentWillReceiveProps(newProps) {
    const rowsByNewType = this.state[newProps.type];
    if(!rowsByNewType || rowsByNewType.length === 0) {
      this.setState({[newProps.type]: [createEmptyCalcRow()]});
    }
  }

  render() {
    const { name, type, updateWeight, containers } = this.props;
    const rowsByType = this.state[type] || [];

    const removeRow = (id) => {
      this.setState({[type]: rowsByType.filter(calcRow => calcRow.id !== id)});
    };

    const updateTare = (id, value) => {
      const newCalcRows = rowsByType.map(calcRow => calcRow.id === id ? {...calcRow, tare: value} : calcRow);
      const newTotal = newCalcRows.reduce((acc, calcRow) => acc + (calcRow.weight - calcRow.tare), 0);
      this.setState({[type]: newCalcRows});
      updateWeight(newTotal);
    };

    const updateGrossWeight = (id, value) => {
      const newCalcRows = rowsByType.map(calcRow => calcRow.id === id ? {...calcRow, weight: value} : calcRow);
      const newTotal = newCalcRows.reduce((acc, calcRow) => acc + (calcRow.weight - calcRow.tare), 0);
      this.setState({[type]: newCalcRows});
      updateWeight(newTotal);
    };

    const calcRowComponents = rowsByType.map((calcRow) => {
      return (
        <CalculatorRow
                key={calcRow.id}
                containers={containers}
                calcRowDatum={calcRow}
                deleteFunc={() => removeRow(calcRow.id)}
                updateTare={(value) => updateTare(calcRow.id, value)}
                updateWeight={(value) => updateGrossWeight(calcRow.id, value)}
              />
      );
    });

    const addRow = () => {
      this.setState({[type]: [...rowsByType, createEmptyCalcRow()]});
    };

    return(
      <div>
        <h3>{`Calculate Weight for: ${name}`}</h3>
        {calcRowComponents}
        <button className="btn new-row" onClick={addRow}>New Row</button>
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
