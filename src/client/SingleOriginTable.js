import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCoffee, updateCoffee, getCoffees, flagForDeletion } from './reducers/inventory';
import SingleOriginRow from './SingleOriginRow';

class SingleOriginTable extends React.Component {
  render() {
    const { addCoffee, updateCoffee, flagForDeletion, singleOriginCoffees } = this.props;
    const singleOriginCoffeeRows = singleOriginCoffees.map((singleOriginCoffee) => {
      return (<SingleOriginRow key={`so-row-${singleOriginCoffee._id}`}
        singleOriginCoffee={singleOriginCoffee}
        updateCoffee={updateCoffee}
        flagForDeletion={flagForDeletion}
      />);
    });
    const addCoffeeButtonRow = <tr><td><button className="add-coffee" onClick={() => addCoffee()}>Add Coffee</button></td></tr>;
    const coffeeWeights = singleOriginCoffees.reduce((acc, coffee) => {
      return {
        roasted: acc.roasted + coffee.roastedWeight,
        green: acc.green + coffee.greenWeight
      };
    }, {green: 0, roasted: 0});

    return (
      <table className="table card">
        <thead>
          <tr>
            <td>Coffee</td>
            <td>Green</td>
            <td>Roasted</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {singleOriginCoffeeRows}
          {addCoffeeButtonRow}
          <tr>
            <td>Total Weights:</td>
            <td className="total-green-weight">{parseFloat(coffeeWeights.green).toFixed(2)}</td>
            <td className="total-roasted-weight">{parseFloat(coffeeWeights.roasted).toFixed(2)}</td>
            <td className="total-coffee-weight">{parseFloat(coffeeWeights.green + coffeeWeights.roasted).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    singleOriginCoffees: getCoffees(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addCoffee, updateCoffee, flagForDeletion }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleOriginTable);
