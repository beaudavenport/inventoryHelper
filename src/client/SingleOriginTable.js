import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCoffee, updateCoffee } from './reducers/singleOriginCoffees';
import SingleOriginRow from './SingleOriginRow';

class SingleOriginTable extends React.Component {
  render() {
    const { addCoffee, updateCoffee } = this.props;
    const singleOriginCoffeeRows = this.props.singleOriginCoffees.map((singleOriginCoffee, index) => {
      return (<SingleOriginRow key={`so-row-${index}`}
        singleOriginCoffee={singleOriginCoffee}
        updateCoffee={updateCoffee}
      />);
    });
    const addCoffeeButtonRow = <tr><td><button className="add-coffee" onClick={() => addCoffee()}>Add Coffee</button></td></tr>;

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
          {addCoffeeButtonRow}
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
  return bindActionCreators({ addCoffee, updateCoffee }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleOriginTable);
