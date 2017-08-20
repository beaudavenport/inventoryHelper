import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SingleOriginRow from '../../src/client/SingleOriginRow';
import CalculatorBar from '../../src/client/CalculatorBar';

describe('SingleOriginRow', () => {
  it('displays delete button that flags item for deletion', () => {
    const flagForDeletion = sinon.spy();
    const singleOriginCoffee = {_id: 555, roastedWeight: 44.5};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      flagForDeletion={flagForDeletion}
    />);

    const deleteButton = wrapper.find('button.delete');
    deleteButton.simulate('click');

    assert.strictEqual(flagForDeletion.args[0][0], singleOriginCoffee._id);
  });

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

  it('displays name with onChange', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678, roastedWeight: 55.5};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);

    const onChange = wrapper.find('.name').prop('onChange');
    const inputEvent = { target: { value: 'Great Scott'} };
    onChange(inputEvent);

    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, name: 'Great Scott'});
  });

  it('displays origin with onChange', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678, roastedWeight: 55.5};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);

    const onChange = wrapper.find('.origin').prop('onChange');
    const inputEvent = { target: { value: 'Nova Scotia'} };
    onChange(inputEvent);

    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, origin: 'Nova Scotia'});
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

  it('displays calculator bar when selected for greenWeight', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 5678, name: 'You got me'};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);
    const greenCalcButton = wrapper.find('button.green');
    greenCalcButton.simulate('click');

    const calcBar = wrapper.find(CalculatorBar);
    const calcBarUpdateFunc = calcBar.prop('updateWeight');
    calcBarUpdateFunc(9.6);

    assert.strictEqual(calcBar.prop('name'), 'You got me');
    assert.strictEqual(calcBar.prop('type'), 'green');
    assert.deepEqual(updateCoffee.args[0][0], {_id: 5678, greenWeight: 9.6, totalWeight: 9.6});
  });

  it('displays calculator bar when selected for roastedWeight', () => {
    const updateCoffee = sinon.spy();
    const singleOriginCoffee = {_id: 9999, name: 'You got them'};
    const wrapper = shallow(<SingleOriginRow
      singleOriginCoffee={singleOriginCoffee}
      updateCoffee={updateCoffee}
    />);
    const roastedCalcButton = wrapper.find('button.roasted');
    roastedCalcButton.simulate('click');

    const calcBar = wrapper.find(CalculatorBar);
    const calcBarUpdateFunc = calcBar.prop('updateWeight');
    calcBarUpdateFunc(5.6);

    assert.strictEqual(calcBar.prop('name'), 'You got them');
    assert.strictEqual(calcBar.prop('type'), 'roasted');
    assert.deepEqual(updateCoffee.args[0][0], {_id: 9999, roastedWeight: 5.6, totalWeight: 5.6});
  });
});
