import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BlendRow from '../../src/client/BlendRow';

describe('BlendRow', () => {
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
});
