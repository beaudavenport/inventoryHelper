import React from 'react';

function calculateTotalWeight(greenWeight, roastedWeight) {
  const greenWeightFloat = greenWeight ? parseFloat(greenWeight) : 0.00;
  const roastedWeightFloat = roastedWeight ? parseFloat(roastedWeight) : 0.00;
  return greenWeightFloat + roastedWeightFloat;
}

function SingleOriginRow({singleOriginCoffee, updateCoffee}) {
  const {_id = 0, name = 'New Coffee', origin = 'Origin', greenWeight = 0, roastedWeight = 0, totalWeight = 0} = singleOriginCoffee;
  const updateGreenWeightWithId = (e) => {
    const newGreenWeight = e.target.value ? parseFloat(e.target.value) : 0;
    updateCoffee({_id, greenWeight: newGreenWeight, totalWeight: calculateTotalWeight(newGreenWeight, roastedWeight)});
  };
  const updateRoastedWeightWithId = (e) => {
    const newRoastedWeight = e.target.value ? parseFloat(e.target.value) : 0;
    updateCoffee({_id, roastedWeight: newRoastedWeight, totalWeight: calculateTotalWeight(greenWeight, newRoastedWeight)});
  };
  const updateName = (e) => {
    updateCoffee({_id, name: e.target.value});
  };
  
  return (
    <tr>
      <td><input onChange={updateName} placeholder={name}></input><input placeholder={origin}></input></td>
      <td><input className="green-weight" type="text" onChange={updateGreenWeightWithId} placeholder={greenWeight} /></td>
      <td><input className="roasted-weight" type="text" onChange={updateRoastedWeightWithId} placeholder={roastedWeight} /></td>
      <td>{parseFloat(totalWeight).toFixed(2)}</td>
    </tr>
  );
}

export default SingleOriginRow;