import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BlendRow from '../../src/client/BlendRow';
import CalculatorBar from '../../src/client/CalculatorBar';

describe('BlendRow', () => {
  it('displays delete button that flags item for deletion', () => {
    const flagForDeletion = sinon.spy();
    const blend = {_id: 333};
    const wrapper = shallow(<BlendRow
      blend={blend}
      flagForDeletion={flagForDeletion}
    />);

    const deleteButton = wrapper.find('button.delete');
    deleteButton.simulate('click');

    assert.strictEqual(flagForDeletion.args[0][0], blend._id);
  });

  it('displays name with onChange', () => {
    const updateBlend = sinon.spy();
    const blend = {_id: 5678};
    const wrapper = shallow(<BlendRow
      blend={blend}
      updateBlend={updateBlend}
    />);

    const onChange = wrapper.find('.name').prop('onChange');
    const inputEvent = { target: { value: 'Great Scott'} };
    onChange(inputEvent);

    assert.deepEqual(updateBlend.args[0][0], {_id: 5678, name: 'Great Scott'});
  });

  it('displays origin with onChange', () => {
    const updateBlend = sinon.spy();
    const blend = {_id: 5678};
    const wrapper = shallow(<BlendRow
      blend={blend}
      updateBlend={updateBlend}
    />);

    const onChange = wrapper.find('.origin').prop('onChange');
    const inputEvent = { target: { value: 'Nova Scotia'} };
    onChange(inputEvent);

    assert.deepEqual(updateBlend.args[0][0], {_id: 5678, origin: 'Nova Scotia'});
  });

  it('displays weight column with onChange', () => {
    const updateBlend = sinon.spy();
    const blend = {_id: 5678};
    const wrapper = shallow(<BlendRow
      blend={blend}
      updateBlend={updateBlend}
    />);

    const onChange = wrapper.find('.blend-weight').prop('onChange');
    const inputEvent = { target: { value: 3.56} };
    onChange(inputEvent);

    assert.deepEqual(updateBlend.args[0][0], {_id: 5678, weight: 3.56});
  });

  it('defaults to 0 when input is blank', () => {
    const updateBlend = sinon.spy();
    const blend = {_id: 5678};
    const wrapper = shallow(<BlendRow
      blend={blend}
      updateBlend={updateBlend}
    />);

    const onChange = wrapper.find('.blend-weight').prop('onChange');
    const inputEvent = { target: { value: null } };
    onChange(inputEvent);

    assert.deepEqual(updateBlend.args[0][0], {_id: 5678, weight: 0});
  });

  it('displays calculator bar when selected for greenWeight', () => {
    const updateBlend = sinon.spy();
    const blend = {_id: 5678};
    const wrapper = shallow(<BlendRow
      blend={blend}
      updateBlend={updateBlend}
    />);

    const calcButton = wrapper.find('button.blend');
    calcButton.simulate('click');

    const calcBar = wrapper.find(CalculatorBar);
    const calcBarUpdateFunc = calcBar.prop('updateWeight');
    calcBarUpdateFunc(9.6);

    assert.strictEqual(calcBar.prop('name'), 'Blend');
    assert.strictEqual(calcBar.prop('type'), 'blend');
    assert.deepEqual(updateBlend.args[0][0], {_id: 5678, weight: 9.6});
  });
});
