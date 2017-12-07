import React from 'react';

export default function CalculatorRow(props) {
  const { containers, rowNumber, updateTare, updateWeight, calcRowDatum, deleteFunc } = props;
  const options = [
    <option key={12345} value={0} disabled={true}>(No container selected)</option>,
    ...containers.map(container => {
      return (
        <option key={container._id} value={container.weight}>{container.name}</option>
      );
    })
  ];

  const netWeight = parseFloat(calcRowDatum.weight) - parseFloat(calcRowDatum.tare);

  return (
    <div className="calculator-row">
      <div>
        <p>Container {rowNumber}</p>
        <button onClick={deleteFunc} className="btn table-button danger delete-row">Delete</button>
      </div>
      <div className="row-edit-input-column">
        <p className="subtitle">Gross Weight</p>
        <input className="gross-weight input" onChange={event => updateWeight(event.target.value)} placeholder={calcRowDatum.weight}></input>
      </div>
      <div className="row-edit-input-column">
        <p className="subtitle">Container Weight</p>
        <select defaultValue={calcRowDatum.tare} onChange={event => updateTare(event.target.value)}>
          {options}
        </select>
        <input className="tare-input input" onChange={event => updateTare(event.target.value)} placeholder={calcRowDatum.tare} />
      </div>
      <p className="net-weight">{netWeight.toFixed(2)}</p>
    </div>
  );
}
