import React from 'react';

function ContainerRow({container, updateContainer}) {
  const {_id = 0, name = 'New Container', weight = 0} = container;
  const updateWeightWithId = (e) => {
    const newWeight = e.target.value ? parseFloat(e.target.value) : 0;
    updateContainer({_id, weight: newWeight});
  };
  const updateName = (e) => {
    updateContainer({_id, name: e.target.value});
  };

  return (
    <tr>
    <td><input onChange={updateName} placeholder={name}></input></td>
    <td><input className="container-weight" type="text" onChange={updateWeightWithId} placeholder={weight} /></td>
    </tr>
  );
}

export default ContainerRow;
