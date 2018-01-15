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
    const { name, type, updateWeight, containers, closeCalcBar } = this.props;
    const rowsByType = this.state[type] || [];

    const removeRow = (id) => {
      const newCalcRows = rowsByType.filter(calcRow => calcRow.id !== id);
      const newTotal = newCalcRows.reduce((acc, calcRow) => acc + (calcRow.weight - calcRow.tare), 0);
      this.setState({[type]: newCalcRows});
      updateWeight(newTotal);
    };

    const updateTare = (id, value) => {
      const newValue = value ? parseFloat(value) : 0;
      const newCalcRows = rowsByType.map(calcRow => calcRow.id === id ? {...calcRow, tare: newValue} : calcRow);
      const newTotal = newCalcRows.reduce((acc, calcRow) => acc + (calcRow.weight - calcRow.tare), 0);
      this.setState({[type]: newCalcRows});
      updateWeight(newTotal);
    };

    const updateGrossWeight = (id, value) => {
      const newValue = value ? parseFloat(value) : 0;
      const newCalcRows = rowsByType.map(calcRow => calcRow.id === id ? {...calcRow, weight: newValue} : calcRow);
      const newTotal = newCalcRows.reduce((acc, calcRow) => acc + (calcRow.weight - calcRow.tare), 0);
      this.setState({[type]: newCalcRows});
      updateWeight(newTotal);
    };

    const calcRowComponents = rowsByType.map((calcRow, index) => {
      return (
        <CalculatorRow
                key={calcRow.id}
                rowNumber={index}
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

    const scrollToMe = () => {
      this.element.scrollIntoView();
    };

    return(
      <div className="calc-bar" ref={(element) => this.element = element }>
        <div className="row-edit-message">
          <p className="edit-header-text">You are calculating <span className="edit-header-name">{type} weight</span> for: <span className="edit-header-name">{name}</span></p>
          <button className="btn row-edit-message-button save" onClick={closeCalcBar}>Done</button>
        </div>
        <div className="sticky-edit-header card calc">
          <p className="sticky-subtitle">Calculating {type} weight for: </p>
          <p className="edit-header-name"> {name}</p>
          <div className="button-bar">
            <button className="btn row-edit-message-button" onClick={scrollToMe}>Go to</button>
            <button className="btn row-edit-message-button" onClick={closeCalcBar}>Done</button>
          </div>
        </div>
        {calcRowComponents}
        <button className="btn table-button new-row" onClick={addRow}>New Row</button>
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
