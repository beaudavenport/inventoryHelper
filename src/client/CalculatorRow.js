import React from 'react';

export default function CalculatorRow(props) {
  const { containers, updateTare, updateWeight, calcRowDatum, deleteFunc } = props;
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
      <button onClick={deleteFunc} className="btn table-button danger delete-row">Delete</button>
      <input className="gross-weight input" onChange={event => updateWeight(event.target.value)} placeholder={calcRowDatum.weight}></input>
      <div className="tare-selection">
        <select defaultValue={calcRowDatum.tare} onChange={event => updateTare(event.target.value)}>
          {options}
        </select>
        <input className="tare-input input" onChange={event => updateTare(event.target.value)} placeholder={calcRowDatum.tare} />
      </div>
      <p className="net-weight">{netWeight.toFixed(2)}</p>
    </div>
  );
}
