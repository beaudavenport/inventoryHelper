import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import LoginBar from '../../src/client/LoginBar';

describe('LoginBar', () => {
  it('calls to action with collection name and password', () => {
    const action = sinon.spy();

    const wrapper = shallow(<LoginBar action={action} message="Get some potato" buttonText="doit"/>);
    const loginButton = wrapper.find('.login');
    const loginMessage = wrapper.find('.login-message');
    wrapper.instance().name = {value: 'potato'};
    wrapper.instance().password = {value: 'foo'};
    loginButton.simulate('click');

    assert.strictEqual(action.args[0][0], 'potato');
    assert.strictEqual(action.args[0][1], 'foo');
    assert.strictEqual(loginMessage.text(), 'Get some potato');
    assert.strictEqual(loginButton.text(), 'doit');
  });

  it('calls cancel action when clicked', () => {
    const cancel = sinon.spy();

    const wrapper = shallow(<LoginBar cancel={cancel} message="Get some squash" buttonText="doit"/>);
    const cancelButton = wrapper.find('.nav-button.cancel');
    cancelButton.simulate('click');

    assert.ok(cancel.calledOnce);
  });
});
