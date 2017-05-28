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
      calcBarName: null
    };
  }

  render() {
    const {singleOriginCoffee, updateCoffee} = this.props;
    const { isCalcBarOpen, calcBarOnChange, calcBarName } = this.state;
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
    const openGreenCalcBar = () => this.setState({isCalcBarOpen: true, calcBarName: 'Green', calcBarOnChange: updateGreenWeightWithId});
    const openRoastedCalcBar = () => this.setState({isCalcBarOpen: true, calcBarName: 'Roasted', calcBarOnChange: updateRoastedWeightWithId});

    const calcBar = isCalcBarOpen ? <CalculatorBar name={calcBarName} updateWeight={calcBarOnChange} /> : null;

    return (
      <tr>
        <td colSpan="4">
          <div className="table-row">
            <div>
              <input onChange={updateName} placeholder={name}></input><input placeholder={origin}></input>
            </div>
            <div>
              <input className="green-weight" type="text" onChange={updateGreenWeightWithId} placeholder={greenWeight} />
              <button className="btn btn-block" onClick={openGreenCalcBar}>Calculate...</button>
            </div>
            <div>
              <input className="roasted-weight" type="text" onChange={updateRoastedWeightWithId} placeholder={roastedWeight} />
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
