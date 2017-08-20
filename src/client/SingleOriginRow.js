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
    const {singleOriginCoffee, updateCoffee, flagForDeletion} = this.props;
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

    const calcBar = isCalcBarOpen ? <CalculatorBar name={name} type={calcBarType} updateWeight={calcBarOnChange} /> : null;
    const greenClassName = calcBarType == 'green' ? 'active-calc' : '';
    const greenCalcButton = calcBarType == 'green' ? <p>Calculating green weight...</p> : <button className="green table-button" onClick={openGreenCalcBar}>Calculate...</button>;
    const roastedClassName = calcBarType == 'roasted' ? 'active-calc' : '';
    const roastedCalcButton = calcBarType == 'roasted' ? <p>Calculating roasted weight...</p> : <button className="roasted table-button" onClick={openRoastedCalcBar}>Calculate...</button>;

    return (
      <tr>
        <td colSpan="4">
          <div className="table-row">
            <div>
              <button className="table-button danger delete" onClick={deleteCoffee}>Delete</button>
            </div>
            <div>
              <input className="name input" onChange={(e) => updateName(e.target.value)} placeholder={name}></input>
              <input className="origin input" onChange={(e) => updateOrigin(e.target.value)} placeholder={origin}></input>
            </div>
            <div className={greenClassName}>
              <input className="green-weight input" type="text" onChange={(e) => updateGreenWeightWithId(e.target.value)} placeholder={greenWeight} />
              {greenCalcButton}
            </div>
            <div className={roastedClassName}>
              <input className="roasted-weight input" type="text" onChange={(e) => updateRoastedWeightWithId(e.target.value)} placeholder={roastedWeight} />
              {roastedCalcButton}
            </div>
            <div>{parseFloat(totalWeight).toFixed(2)}</div>
          </div>
          <div className="calc-bar">
            {calcBar}
          </div>
        </td>
      </tr>
    );
  }
}

export default SingleOriginRow;
