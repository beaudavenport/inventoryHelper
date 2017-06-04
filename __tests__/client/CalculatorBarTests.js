import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ConnectedCalculatorBar, { CalculatorBar } from '../../src/client/CalculatorBar';
import CalculatorRow from '../../src/client/CalculatorRow';

describe('CalculatorBar', () => {
  it('displays calculator row with container options passed in', () => {
    const container1 = {_id: 78, category: 'container', name: 'foo', weight: 89};
    const container2 = {_id: 67, category: 'container', name: 'orange', weight: 34};

    const mockStore = configureStore()({inventory: [container1, container2]});
    const wrapper = shallow(<ConnectedCalculatorBar store={mockStore}/>);

    const calculatorRow = wrapper.dive().find(CalculatorRow);
    assert.deepEqual(calculatorRow.prop('containers'), [container1, container2]);
  });

  it('adds calculator row when new row button is clicked', () => {
    const wrapper = shallow(<CalculatorBar />);

    const originalCalcRows = wrapper.find(CalculatorRow);
    const newRowButton = wrapper.find('.new-row');
    assert.strictEqual(originalCalcRows.length, 1);

    newRowButton.simulate('click');
    assert.strictEqual(wrapper.find(CalculatorRow).length, 2);
  });

  it('removes calculator row when delete button is clicked', () => {
    const wrapper = shallow(<CalculatorBar />);
    wrapper.setState({calculatorRows: [
      {id: 781, weight: 1, tare: 1},
      {id: 999, weight: 89, tare:45},
      {id: 900, weight: 0, tare: 0}
    ]});
    const originalCalcRows = wrapper.find(CalculatorRow);
    assert.strictEqual(originalCalcRows.length, 3);
    const secondRowDelete = originalCalcRows.at(1).prop('deleteFunc');

    secondRowDelete();

    assert.strictEqual(wrapper.find(CalculatorRow).length, 2);
    assert.deepEqual(wrapper.state('calculatorRows'),
      [{id: 781, weight: 1, tare: 1}, {id: 900, weight: 0, tare: 0}]
    );
  });

  it('passes callback to update tare and update global weight', () => {
    const updateWeight = sinon.spy();
    const wrapper = shallow(<CalculatorBar updateWeight={updateWeight} />);
    wrapper.setState({calculatorRows: [
      {id: 781, weight: 5.3, tare: 1},
    ]});
    const calcRow = wrapper.find(CalculatorRow);
    const updateTare = calcRow.prop('updateTare');

    updateTare(2.25);

    assert.deepEqual(wrapper.state('calculatorRows'),
      [{id: 781, weight: 5.3, tare: 2.25}]
    );
    assert.deepEqual(updateWeight.args[0][0], 3.05);
  });

  it('passes callback to update weight and update global weight', () => {
    const updateWeight = sinon.spy();
    const wrapper = shallow(<CalculatorBar updateWeight={updateWeight}/>);
    wrapper.setState({calculatorRows: [
      {id: 781, weight: 1, tare: 15.5},
    ]});
    const calcRow = wrapper.find(CalculatorRow);
    const updateWeightFunc = calcRow.prop('updateWeight');

    updateWeightFunc(664.5);

    assert.deepEqual(wrapper.state('calculatorRows'),
      [{id: 781, weight: 664.5, tare: 15.5}]
    );
    assert.deepEqual(updateWeight.args[0][0], 649.00);
  });

  it('passes calculated netWeight to row', () => {
    const wrapper = shallow(<CalculatorBar />);
    wrapper.setState({calculatorRows: [
      {id: 781, weight: 7.7, tare: 1.6},
    ]});

    const calcRow = wrapper.find(CalculatorRow);

    assert.strictEqual(calcRow.prop('netWeight'), 6.1);
  });
});
