import React from 'react';
import CalculatorBar from './CalculatorBar';

class BlendRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCalcBarOpen: false
    };
  }

  render() {
    const {blend, updateBlend, flagForDeletion, closeActiveRow} = this.props;
    const { isCalcBarOpen } = this.state;
    const {_id = 0, name = 'New Blend', origin = 'Origin', weight = 0} = blend;
    const updateWeightWithId = (value) => {
      const newWeight = value ? parseFloat(value) : 0;
      updateBlend({_id, weight: newWeight});
    };
    const updateName = (value) => {
      updateBlend({_id, name: value});
    };
    const updateOrigin = (value) => {
      updateBlend({_id, origin: value});
    };
    const deleteBlend = () => {
      flagForDeletion(_id);
    };
    const openCalcBar = () => this.setState({isCalcBarOpen: true});
    const closeCalcBar = () => this.setState({isCalcBarOpen: false});

    const calcBar = isCalcBarOpen ? <CalculatorBar name="Blend" type="blend" updateWeight={updateWeightWithId} closeCalcBar={closeCalcBar} /> : null;
    const calcButton = isCalcBarOpen ? null : <button className="blend btn table-button" onClick={openCalcBar}>Calculate...</button>;
    const activeCalcClass = isCalcBarOpen ? 'active-calc' : '';

    return (
      <tr>
        <td colSpan="3" className="row-edit">
          <div className="row-edit-message">
            <p className="edit-header-text">You are editing the blend <span className="edit-header-name">{name}</span></p>
            <button className="btn row-edit-message-button save" onClick={closeActiveRow}>Done</button>
            <button className="btn row-edit-message-button danger delete" onClick={deleteBlend}>Delete</button>
          </div>
          <div className="editing-table-row">
            <div className="row-edit-input-column">
              <p className="subtitle">Name and Origin</p>
              <input className="name input" onChange={(e) => updateName(e.target.value)} placeholder={name}></input>
              <input className="origin input" onChange={(e) => updateOrigin(e.target.value)} placeholder={origin}></input>
            </div>
            <div className={`row-edit-input-column ${activeCalcClass}`}>
              <p className="subtitle">Bulk Weight</p>
              <input disabled={isCalcBarOpen} className="blend-weight input" type="text" onChange={(e) => updateWeightWithId(e.target.value)} placeholder={weight} />
              {calcButton}
            </div>
            <div>{parseFloat(weight).toFixed(2)}</div>
          </div>
          <div>
            {calcBar}
          </div>
        </td>
      </tr>
    );
  }
}

export default BlendRow;
