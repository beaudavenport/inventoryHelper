import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import Guid from 'guid';
import { shallow } from 'enzyme';
import CalculatorRow from '../../src/client/CalculatorRow';

describe('CalculatorRow', () => {
  it('displays current tare, gross weight, and netWeight', () => {
    const calcRowDatum = { id: 999, weight: 8.5, tare: 1.4};
    const wrapper = shallow(<CalculatorRow containers={[]}  calcRowDatum={calcRowDatum} />);

    const grossWeightInput = wrapper.find('.gross-weight');
    const tareInput = wrapper.find('.tare-input');
    const netWeight = wrapper.find('.net-weight');

    assert.strictEqual(grossWeightInput.prop('placeholder'), calcRowDatum.weight.toFixed(2));
    assert.strictEqual(tareInput.prop('placeholder'), calcRowDatum.tare.toFixed(2));
    assert.strictEqual(netWeight.text(), '7.10');
  });

  it('defaults to select container that matches tare weight', () => {
    const calcRowDatum = { id: 999, weight: 8.5, tare: 1.4};
    const container = { _id: 111, name: 'meatSack', weight: 1.4};
    const otherContainer = { _id: 222, name: 'holefilled', weight: 15};

    const wrapper = shallow(<CalculatorRow containers={[container, otherContainer]}  calcRowDatum={calcRowDatum} />);
    const selectContainer = wrapper.find('select');
    assert.strictEqual(selectContainer.prop('defaultValue'), container.weight);
  });

  it('displays containers in select menu', () => {
    const container1 = {name: 'foo', weight: 98};
    const container2 = {name: 'bag', weight: 56};
    const containers = [container1, container2];
    const wrapper = shallow(<CalculatorRow calcRowDatum={{id: Guid.raw(), weight: 0, tare: 0}} containers={containers} />);

    const options = wrapper.find('option');
    assert.deepEqual(options.at(0).prop('value'), 0);
    assert.deepEqual(options.at(0).text(), '(No container selected)');
    assert.deepEqual(options.at(1).prop('value'), container1.weight);
    assert.deepEqual(options.at(1).text(), container1.name);
    assert.deepEqual(options.at(2).prop('value'), container2.weight);
    assert.deepEqual(options.at(2).text(), container2.name);
  });

  it('calls to updateTare with selected container weight', () => {
    const updateTare = sinon.spy();
    const wrapper = shallow(<CalculatorRow calcRowDatum={{id: Guid.raw(), weight: 0, tare: 0}} containers={[]} updateTare={updateTare} />);
    const selectContainer = wrapper.find('select');

    selectContainer.simulate('change', {target: {value: 987.89}});

    assert.deepEqual(updateTare.args[0][0], 987.89);
  });

  it('calls to updateTare with input tare weight', () => {
    const updateTare = sinon.spy();
    const wrapper = shallow(<CalculatorRow calcRowDatum={{id: Guid.raw(), weight: 0, tare: 0}} containers={[]} updateTare={updateTare} />);
    const selectContainer = wrapper.find('.tare-input');

    selectContainer.simulate('change', {target: {value: 987.89}});

    assert.deepEqual(updateTare.args[0][0], 987.89);
  });

  it('calls to updateWeight with input weight', () => {
    const updateWeight = sinon.spy();
    const wrapper = shallow(<CalculatorRow calcRowDatum={{id: Guid.raw(), weight: 0, tare: 0}} containers={[]} updateWeight={updateWeight} />);
    const grossWeightInput = wrapper.find('.gross-weight');

    grossWeightInput.simulate('change', {target: {value: 55.55}});

    assert.deepEqual(updateWeight.args[0][0], 55.55);
  });

  it('calls to delete when delete button clicked', () => {
    const deleteFunc = sinon.spy();
    const wrapper = shallow(<CalculatorRow calcRowDatum={{id: Guid.raw(), weight: 0, tare: 0}} containers={[]} deleteFunc={deleteFunc} />);
    const deleteButton = wrapper.find('.delete-row');

    deleteButton.simulate('click');

    assert.ok(deleteFunc.calledOnce);
  });
});
