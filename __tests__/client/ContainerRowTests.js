import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import ContainerRow from '../../src/client/ContainerRow';

describe('ContainerRow', () => {
  it('displays weight column with onChange that updates weight', () => {
    const updateContainer = sinon.spy();
    const container = {_id: 34, weight: 89.5};
    const wrapper = shallow(<ContainerRow
      container={container}
      updateContainer={updateContainer}
    />);

    const onChange = wrapper.find('.container-weight').prop('onChange');
    const inputEvent = { target: { value: 3.56} };
    onChange(inputEvent);

    assert.deepEqual(updateContainer.args[0][0], {_id: 34, weight: 3.56});
  });

  it('defaults to 0 when input is blank', () => {
    const updateContainer = sinon.spy();
    const container = {_id: 5678};
    const wrapper = shallow(<ContainerRow
      container={container}
      updateContainer={updateContainer}
    />);

    const onChange = wrapper.find('.container-weight').prop('onChange');
    const inputEvent = { target: { value: undefined } };
    onChange(inputEvent);

    assert.deepEqual(updateContainer.args[0][0], {_id: 5678, weight: 0});
  });
});
