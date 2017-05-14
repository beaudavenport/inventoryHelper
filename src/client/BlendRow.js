import React from 'react';

function BlendRow({blend, updateBlend}) {
  const {_id = 0, name = 'New Blend', origin = 'Origin', weight = 0} = blend;
  const updateWeightWithId = (e) => {
    const newWeight = e.target.value ? parseFloat(e.target.value) : 0;
    updateBlend({_id, weight: newWeight});
  };
  const updateName = (e) => {
    updateBlend({_id, name: e.target.value});
  };

  return (
    <tr>
      <td><input onChange={updateName} placeholder={name}></input><input placeholder={origin}></input></td>
      <td><input className="blend-weight" type="text" onChange={updateWeightWithId} placeholder={weight} /></td>
    </tr>
  );
}

export default BlendRow;
