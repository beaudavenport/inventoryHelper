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
    const {singleOriginCoffee, updateCoffee} = this.props;
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
    const openGreenCalcBar = () => this.setState({isCalcBarOpen: true, calcBarType: 'green', calcBarName: 'Green', calcBarOnChange: updateGreenWeightWithId});
    const openRoastedCalcBar = () => this.setState({isCalcBarOpen: true, calcBarType: 'roasted', calcBarName: 'Roasted', calcBarOnChange: updateRoastedWeightWithId});

    const calcBar = isCalcBarOpen ? <CalculatorBar name={calcBarName} type={calcBarType} updateWeight={calcBarOnChange} /> : null;

    return (
      <tr>
        <td colSpan="4">
          <div className="table-row">
            <div>
              <input className="name" onChange={(e) => updateName(e.target.value)} placeholder={name}></input>
              <input className="origin" onChange={(e) => updateOrigin(e.target.value)} placeholder={origin}></input>
            </div>
            <div>
              <input className="green-weight" type="text" onChange={(e) => updateGreenWeightWithId(e.target.value)} placeholder={greenWeight} />
              <button className="btn btn-block" onClick={openGreenCalcBar}>Calculate...</button>
            </div>
            <div>
              <input className="roasted-weight" type="text" onChange={(e) => updateRoastedWeightWithId(e.target.value)} placeholder={roastedWeight} />
              <button className="btn btn-block" onClick={openRoastedCalcBar}>Calculate...</button>
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
