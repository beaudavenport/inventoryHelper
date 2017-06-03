import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CalculatorRow from '../../src/client/CalculatorRow';

describe('CalculatorRow', () => {
  it('displays netWeight', () => {
    const wrapper = shallow(<CalculatorRow containers={[]} netWeight={9.87} />);
    const netWeight = wrapper.find('.net-weight');

    assert.strictEqual(netWeight.text(), '9.87');
  });

  it('displays containers in select menu', () => {
    const container1 = {name: 'foo', weight: 98};
    const container2 = {name: 'bag', weight: 56};
    const containers = [container1, container2];
    const wrapper = shallow(<CalculatorRow containers={containers} />);

    const options = wrapper.find('option');
    assert.deepEqual(options.at(0).prop('value'), container1.weight);
    assert.deepEqual(options.at(0).text(), container1.name);
    assert.deepEqual(options.at(1).prop('value'), container2.weight);
    assert.deepEqual(options.at(1).text(), container2.name);
  });

  it('calls to updateTare with selected container weight', () => {
    const updateTare = sinon.spy();
    const wrapper = shallow(<CalculatorRow containers={[]} updateTare={updateTare} />);
    const selectContainer = wrapper.find('select');

    selectContainer.simulate('change', {target: {value: 987.89}});

    assert.deepEqual(updateTare.args[0][0], 987.89);
  });

  it('calls to updateWeight with input weight', () => {
    const updateWeight = sinon.spy();
    const wrapper = shallow(<CalculatorRow containers={[]} updateWeight={updateWeight} />);
    const grossWeightInput = wrapper.find('input');

    grossWeightInput.simulate('change', {target: {value: 55.55}});

    assert.deepEqual(updateWeight.args[0][0], 55.55);
  });

  it('calls to delete when delete button clicked', () => {
    const deleteFunc = sinon.spy();
    const wrapper = shallow(<CalculatorRow containers={[]} deleteFunc={deleteFunc} />);
    const deleteButton = wrapper.find('.delete-row');

    deleteButton.simulate('click');

    assert.ok(deleteFunc.calledOnce);
  });
});
