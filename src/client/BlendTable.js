import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBlends } from './reducers/inventory';
import BlendRow from './BlendRow';

class BlendTable extends React.Component {

  render() {
    const { blends } = this.props;
    
    return (
      <table>
        <thead>
          <tr>
            <td>Blend</td>
            <td>Weight</td>
          </tr>
          <BlendRow blend={blends[0]} />
        </thead>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    blends: getBlends(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  // return bindActionCreators({ addCoffee, updateCoffee }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BlendTable);
