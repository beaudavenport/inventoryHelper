import React from 'react';
import CalculatorBar from './CalculatorBar';

function calculateTotalWeight(greenWeight, roastedWeight) {
  const greenWeightFloat = greenWeight ? parseFloat(greenWeight) : 0.00;
  const roastedWeightFloat = roastedWeight ? parseFloat(roastedWeight) : 0.00;
  return greenWeightFloat + roastedWeightFloat;
}

class SingleOriginRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCalcBarOpen: false,
      calcBarOnChange: null,
      calcBarType: null,
      calcBarName: null
    };
  }

  render() {
    const {singleOriginCoffee, updateCoffee, flagForDeletion, closeActiveRow} = this.props;
    const { isCalcBarOpen, calcBarOnChange, calcBarType, calcBarName } = this.state;
    const {_id = 0, name = 'New Coffee', origin = 'Origin', greenWeight = 0, roastedWeight = 0, totalWeight = 0} = singleOriginCoffee;
    const updateGreenWeightWithId = (value) => {
      const newGreenWeight = value ? parseFloat(value) : 0;
      updateCoffee({_id, greenWeight: newGreenWeight, totalWeight: calculateTotalWeight(newGreenWeight, roastedWeight)});
    };
    const updateRoastedWeightWithId = (value) => {
      const newRoastedWeight = value ? parseFloat(value) : 0;
      updateCoffee({_id, roastedWeight: newRoastedWeight, totalWeight: calculateTotalWeight(greenWeight, newRoastedWeight)});
    };
    const updateName = (value) => {
      updateCoffee({_id, name: value});
    };
    const updateOrigin = (value) => {
      updateCoffee({_id, origin: value});
    };
    const deleteCoffee = () => {
      flagForDeletion(_id);
    };

    const openGreenCalcBar = () => this.setState({isCalcBarOpen: true, calcBarType: 'green', calcBarName: 'Green', calcBarOnChange: updateGreenWeightWithId});
    const openRoastedCalcBar = () => this.setState({isCalcBarOpen: true, calcBarType: 'roasted', calcBarName: 'Roasted', calcBarOnChange: updateRoastedWeightWithId});
    const closeCalcBar = () => this.setState({isCalcBarOpen: false, calcBarType: null, calcBarName: null, calcBarOnChange: null});
    const scrollToMe = () => {
      this.element.scrollIntoView();
    };
    const calcBar = isCalcBarOpen ? <CalculatorBar name={name} type={calcBarType} updateWeight={calcBarOnChange} closeCalcBar={closeCalcBar} /> : null;
    const greenClassName = calcBarType == 'green' ? 'active-calc' : '';
    const greenCalcButton = calcBarType == 'green' ? null : <button className="green btn table-button" onClick={openGreenCalcBar}>Calculate...</button>;
    const roastedClassName = calcBarType == 'roasted' ? 'active-calc' : '';
    const roastedCalcButton = calcBarType == 'roasted' ? null : <button className="roasted btn table-button" onClick={openRoastedCalcBar}>Calculate...</button>;

    return (
      <tr ref={(element) => this.element = element }>
        <td colSpan="4" className="row-edit first-column">
          <div className="toggle-icon"><i className="fa fa-chevron-down"></i></div>
          <div className="row-edit-message">
            <p className="edit-header-text">You are editing the coffee <span className="edit-header-name">{singleOriginCoffee.name}</span></p>
            <button className="btn row-edit-message-button save" onClick={closeActiveRow}>Done</button>
            <button className="btn row-edit-message-button danger delete" onClick={deleteCoffee}>Delete</button>
          </div>
          <div className="sticky-edit-header card">
            <p>Editing Coffee: <span className="edit-header-name">{name}</span></p>
            <div className="button-bar">
              <button className="btn row-edit-message-button" onClick={scrollToMe}>Go to</button>
              <button className="btn row-edit-message-button" onClick={closeActiveRow}>Done</button>
            </div>
          </div>
          <div className="editing-table-row">
            <div className="row-edit-input-column">
              <p className="subtitle">Name and Origin</p>
              <input className="name input" onChange={(e) => updateName(e.target.value)} placeholder={name}></input>
              <input className="origin input" onChange={(e) => updateOrigin(e.target.value)} placeholder={origin}></input>
            </div>
            <div className={`row-edit-input-column ${greenClassName}`}>
              <p className="subtitle">Green Weight</p>
              <input disabled={calcBarType == 'green'} className="green-weight input" type="text" onChange={(e) => updateGreenWeightWithId(e.target.value)} placeholder={greenWeight} />
              {greenCalcButton}
            </div>
            <div className={`row-edit-input-column ${roastedClassName}`}>
              <p className="subtitle">Roasted Weight</p>
              <input disabled={calcBarType == 'roasted'}  className="roasted-weight input" type="text" onChange={(e) => updateRoastedWeightWithId(e.target.value)} placeholder={roastedWeight} />
              {roastedCalcButton}
            </div>
            <div>
              <p className="subtitle">Total Weight</p>
              <p>{parseFloat(totalWeight).toFixed(2)}</p>
            </div>
          </div>
          <div>
            {calcBar}
          </div>
        </td>
      </tr>
    );
  }
}

export default SingleOriginRow;
