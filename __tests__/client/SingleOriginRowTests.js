import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SingleOriginRow from '../../src/client/SingleOriginRow';

describe('SingleOriginRow', () => {
  it('displays greenWeight column with onChange that updates with calculated roastedWeight', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678, roastedWeight: 55.5};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);

    const onGreenChange = wrapper.find('.green-weight').prop('onChange');
    const greenInputEvent = { target: { value: 3.56} };
    onGreenChange(greenInputEvent);

    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, greenWeight: 3.56, totalWeight: 59.06});
  });

  it('displays roastedWeight column with onChange that updates with calculated roastedWeight', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678, greenWeight: 90};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);

    const onRoastedChange = wrapper.find('.roasted-weight').prop('onChange');
    const roastedInputEvent = { target: { value: 4.97} };
    onRoastedChange(roastedInputEvent);

    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, roastedWeight: 4.97, totalWeight: 94.97});
  });

  it('defaults to 0 when input is blank', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);

    const onGreenChange = wrapper.find('.green-weight').prop('onChange');
    const onRoastedChange = wrapper.find('.roasted-weight').prop('onChange');
    const greenInputEvent = { target: { value: null } };
    const roastedInputEvent = { target: { value: undefined } };
    onGreenChange(greenInputEvent);
    onRoastedChange(roastedInputEvent);

    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, greenWeight: 0, totalWeight: 0});
    assert.deepEqual(updateCoffee.args[1][0], {_id: 5678, roastedWeight: 0, totalWeight: 0});
  });
});
