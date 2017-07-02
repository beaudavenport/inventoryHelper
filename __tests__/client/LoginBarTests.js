import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import LoginBar from '../../src/client/LoginBar';

describe('LoginBar', () => {
  it('calls to login action with collection name and password', () => {
    const loginAction = sinon.spy();

    const wrapper = shallow(<LoginBar login={loginAction} />);
    const loginButton = wrapper.find('.btn.login');
    wrapper.instance().name = {value: 'potato'};
    wrapper.instance().password = {value: 'foo'};
    loginButton.simulate('click');

    assert.strictEqual(loginAction.args[0][0], 'potato');
    assert.strictEqual(loginAction.args[0][1], 'foo');
  });

  it('calls to create action with collection name and password', () => {

  });
});
