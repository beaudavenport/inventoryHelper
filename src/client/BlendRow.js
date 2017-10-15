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
    const {blend, updateBlend, flagForDeletion} = this.props;
    const {isCalcBarOpen} = this.state;
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

    const calcBar = isCalcBarOpen ? <CalculatorBar name="Blend" type="blend" updateWeight={updateWeightWithId} /> : null;

    return (
      <tr>
        <td colSpan="3">
          <div className="editing-table-row">
            <div>
              <button className="btn table-button danger delete" onClick={deleteBlend}>X</button>
            </div>
            <div>
              <input className="name input" onChange={(e) => updateName(e.target.value)} placeholder={name}></input>
              <input className="origin input"  onChange={(e) => updateOrigin(e.target.value)} placeholder={origin}></input>
            </div>
            <div>
              <input className="blend-weight input" type="text" onChange={(e) => updateWeightWithId(e.target.value)} placeholder={weight} />
              <button className="blend btn table-button" onClick={openCalcBar}>Calculate...</button>
            </div>
            <div>{parseFloat(weight).toFixed(2)}</div>
          </div>
          <div className="calc-bar">
            {calcBar}
          </div>
        </td>
      </tr>
    );
  }
}

export default BlendRow;
