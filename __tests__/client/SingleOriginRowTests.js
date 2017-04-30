import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SingleOriginRow from '../../src/client/SingleOriginRow';

describe('SingleOriginRow', () => {
  it('displays greenWeight and roastedWeight columns which call to update on input', () => {
    const updateGreenWeight = sinon.spy();
    const updateRoastedWeight = sinon.spy();
    const singleOriginCoffee = {_id: 5678};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateGreenWeight={updateGreenWeight}
      updateRoastedWeight={updateRoastedWeight}
    />);

    const onGreenChange = wrapper.find('.green-weight').prop('onChange');
    const onRoastedChange = wrapper.find('.roasted-weight').prop('onChange');
    const greenInputEvent = { target: { value: 'good green stuff'} };
    const roastedInputEvent = { target: { value: 'good roasted stuff'} };
    onGreenChange(greenInputEvent);
    onRoastedChange(roastedInputEvent);

    assert.strictEqual(updateGreenWeight.args[0][0], 5678);
    assert.strictEqual(updateGreenWeight.args[0][1], 'good green stuff');
    assert.strictEqual(updateRoastedWeight.args[0][0], 5678);
    assert.strictEqual(updateRoastedWeight.args[0][1], 'good roasted stuff');
  });
});
