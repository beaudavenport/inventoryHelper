import React from 'react';

export default function CalculatorRow(props) {
  const { containers, updateTare, updateWeight, calcRowDatum, deleteFunc } = props;
  const options = containers.map(container => {
    return (
      <option key={container._id} value={container.weight}>{container.name}</option>
    );
  });
  const netWeight = parseFloat(calcRowDatum.weight) - parseFloat(calcRowDatum.tare);

  return (
    <div className="calculator-row">
      <button onClick={deleteFunc} className="table-button danger delete-row">Delete</button>
      <input className="gross-weight input" onChange={event => updateWeight(event.target.value)} placeholder={calcRowDatum.weight}></input>
      <div>
        <select defaultValue={calcRowDatum.tare} onChange={event => updateTare(event.target.value)}>
          {options}
        </select>
        <input className="tare-input input" onChange={event => updateTare(event.target.value)} placeholder={calcRowDatum.tare} />
      </div>
      <p className="net-weight">{netWeight.toFixed(2)}</p>
    </div>
  );
}
