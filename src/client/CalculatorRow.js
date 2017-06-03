import React from 'react';

export default function CalculatorRow(props) {
  const { containers, updateTare, updateWeight, netWeight, deleteFunc } = props;
  const options = containers.map(container => {
    return (
      <option key={container._id} value={container.weight}>{container.name}</option>
    );
  });

  return (
    <div>
      <button onClick={deleteFunc} className="delete-row btn btn-danger">X</button>
      <p className="net-weight">{parseFloat(netWeight).toFixed(2)}</p>
      <select onChange={event => updateTare(event.target.value)}>
        {options}
      </select>
      <input onChange={event => updateWeight(event.target.value)} placeholder="Enter gross weight"></input>
    </div>
  );
}
