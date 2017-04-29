import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCoffee } from './reducers';

class SingleOriginTable extends React.Component {
  render() {
    const singleOriginCoffeeRows = this.props.singleOriginCoffees.map(singleOriginCoffee => {
      const updateGreenWeight = (e) => {
        const formattedWeight = e.target.value ? parseFloat(e.target.value) : 0;
        this.props.updateCoffee({_id, greenWeight: formattedWeight});
      };
      const updateRoastedWeight = (e) => {
        const formattedWeight = e.target.value ? parseFloat(e.target.value) : 0;
        this.props.updateCoffee({_id, roastedWeight: formattedWeight});
      };

      const {_id = 0, name = 'New Coffee', origin = 'Origin', greenWeight = 0, roastedWeight = 0, totalWeight = 0} = singleOriginCoffee;
      return (
        <tr>
          <td><h3>{name}</h3><h4>{origin}</h4></td>
          <td><input type="text" onChange={updateGreenWeight} placeholder={greenWeight} /></td>
          <td><input type="text" onChange={updateRoastedWeight} placeholder={roastedWeight} /></td>
          <td>{totalWeight.toFixed(2)}</td>
        </tr>
      );
    });
    return (
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
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    singleOriginCoffees: state.singleOriginCoffees
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateCoffee }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleOriginTable);
