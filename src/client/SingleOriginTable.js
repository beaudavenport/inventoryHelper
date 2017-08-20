import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCoffee, updateCoffee, getCoffees, flagForDeletion } from './reducers/inventory';
import SingleOriginRow from './SingleOriginRow';

class SingleOriginTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRow: null
    };
  }

  render() {
    const { addCoffee, updateCoffee, flagForDeletion, singleOriginCoffees } = this.props;
    const { activeRow } = this.state;

    const setActiveRow = (id) => this.setState({activeRow: id});
    const singleOriginCoffeeRows = singleOriginCoffees.map((singleOriginCoffee) => {
      if(singleOriginCoffee._id === activeRow) {
        return (<SingleOriginRow key={`so-row-${singleOriginCoffee._id}`}
          singleOriginCoffee={singleOriginCoffee}
          updateCoffee={updateCoffee}
          flagForDeletion={flagForDeletion}
        />);
      }
      return (<tr className="inactive-row" key={`so-tr-${singleOriginCoffee._id}`} onClick={() => setActiveRow(singleOriginCoffee._id)}>
          <td>{`${singleOriginCoffee.name}, ${singleOriginCoffee.origin}`}</td>
          <td>{parseFloat(singleOriginCoffee.greenWeight).toFixed(2)}</td>
          <td>{parseFloat(singleOriginCoffee.roastedWeight).toFixed(2)}</td>
          <td>{parseFloat(singleOriginCoffee.totalWeight).toFixed(2)}</td>
          </tr>);
    });

    const addCoffeeButtonRow = <tr><td colSpan="4"><button className="table-button add-coffee" onClick={() => addCoffee()}>Add Coffee</button></td></tr>;
    const coffeeWeights = singleOriginCoffees.reduce((acc, coffee) => {
      return {
        roasted: acc.roasted + coffee.roastedWeight,
        green: acc.green + coffee.greenWeight
      };
    }, {green: 0, roasted: 0});

    return (
      <div className="card">
        <div className="table-header">
          <h2>Single Origin Coffees</h2>
          <button className="table-button add-coffee" onClick={() => addCoffee()}><i className="fa fa-plus"></i> Add Coffee</button>
        </div>
        <table className="table">
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
            <tr>
              <td>Total Weights:</td>
              <td className="total-green-weight">{parseFloat(coffeeWeights.green).toFixed(2)}</td>
              <td className="total-roasted-weight">{parseFloat(coffeeWeights.roasted).toFixed(2)}</td>
              <td className="total-coffee-weight">{parseFloat(coffeeWeights.green + coffeeWeights.roasted).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
