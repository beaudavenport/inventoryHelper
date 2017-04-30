import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCoffee } from './reducers';
import SingleOriginRow from './SingleOriginRow';

class SingleOriginTable extends React.Component {
  render() {
    const { updateCoffee } = this.props;
    const singleOriginCoffeeRows = this.props.singleOriginCoffees.map((singleOriginCoffee, index) => {
      return (<SingleOriginRow key={`so-row-${index}`}
        singleOriginCoffee={singleOriginCoffee}
        updateCoffee={updateCoffee}
      />);
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
