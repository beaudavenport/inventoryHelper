import React from 'react';

function ContainerRow({container, updateContainer, flagForDeletion, closeActiveRow}) {
  const {_id = 0, name = 'New Container', weight = 0} = container;
  const updateWeightWithId = (e) => {
    const newWeight = e.target.value ? parseFloat(e.target.value) : 0;
    updateContainer({_id, weight: newWeight});
  };
  const updateName = (e) => {
    updateContainer({_id, name: e.target.value});
  };
  const deleteContainer = () => {
    flagForDeletion(_id);
  };

  return (
    <tr>
      <td colSpan="2" className="row-edit">
        <div className="row-edit-message">
          <p className="edit-header-text">You are editing the container <span className="edit-header-name">{name}</span></p>
          <button className="btn row-edit-message-button save" onClick={closeActiveRow}>Done</button>
          <button className="btn row-edit-message-button danger delete" onClick={deleteContainer}>Delete</button>
        </div>
        <div className="editing-table-row">
          <div className="row-edit-input-column">
            <p className="subtitle">Container Name</p>
            <input className="name input" onChange={updateName} placeholder={name}></input>
          </div>
          <div className="row-edit-input-column">
            <p className="subtitle">Weight</p>
            <input className="container-weight input" type="text" onChange={updateWeightWithId} placeholder={weight.toFixed(2)} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default ContainerRow;
