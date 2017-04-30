import React from 'react';

function SingleOriginRow({singleOriginCoffee, updateGreenWeight, updateRoastedWeight}) {
  const {_id = 0, name = 'New Coffee', origin = 'Origin', greenWeight = 0, roastedWeight = 0, totalWeight = 0} = singleOriginCoffee;
  const updateGreenWeightWithId = (e) =>  updateGreenWeight(_id, e.target.value);
  const updateRoastedWeightWithId = (e) => updateRoastedWeight(_id, e.target.value);

  return (
    <tr>
      <td><h3>{name}</h3><h4>{origin}</h4></td>
      <td><input className="green-weight" type="text" onChange={updateGreenWeightWithId} placeholder={greenWeight} /></td>
      <td><input className="roasted-weight" type="text" onChange={updateRoastedWeightWithId} placeholder={roastedWeight} /></td>
      <td>{totalWeight.toFixed(2)}</td>
    </tr>
  );
}

export default SingleOriginRow;
