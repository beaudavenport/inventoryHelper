import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import ConnectedNavbar, { Navbar } from '../../src/client/Navbar';
import LoginBar from '../../src/client/LoginBar';

describe('Navbar', () => {
  it('renders default title if not logged in', () => {
    const mockStore = configureStore()({metadata: {}});
    const wrapper = shallow(<ConnectedNavbar store={mockStore} />);

    const collectionName = wrapper.dive().find('.collection-name');
    assert.strictEqual(collectionName.text(), 'New Inventory');
  });

  it('renders collection name if logged in', () => {
    const mockStore = configureStore()({metadata: {collectionName: 'GreatBigPotatoes'}});
    const wrapper = shallow(<ConnectedNavbar store={mockStore} />);

    const collectionName = wrapper.dive().find('.collection-name');
    assert.strictEqual(collectionName.text(), 'GreatBigPotatoes');
  });

  it('displays login panel when login selected', () => {
    const loginSpy = sinon.spy();
    const wrapper = shallow(<Navbar login={loginSpy} metadata={{}}/>);

    const loginButton = wrapper.find('.login-toggle');
    loginButton.simulate('click');

    const loginBar = wrapper.find(LoginBar);
    assert.strictEqual(loginBar.prop('action'), loginSpy);
    assert.strictEqual(loginBar.prop('message'), 'Login');
    assert.strictEqual(loginBar.prop('buttonText'), 'Login');
  });

  it('displays create panel when create selected', () => {
    const createNewSpy = sinon.spy();
    const wrapper = shallow(<Navbar createNew={createNewSpy} metadata={{}}/>);

    const createButton = wrapper.find('.create-toggle');
    createButton.simulate('click');

    const loginBar = wrapper.find(LoginBar);
    assert.strictEqual(loginBar.prop('action'), createNewSpy);
    assert.strictEqual(loginBar.prop('message'), 'Create new inventory');
    assert.strictEqual(loginBar.prop('buttonText'), 'Create');
  });

  it('passes cancel function to login or create bar', () => {
    const wrapper = shallow(<Navbar createNew={() => {}} login={() => {}} metadata={{}}/>);

    const createButton = wrapper.find('.create-toggle');
    createButton.simulate('click');
    const cancelFunc = wrapper.find(LoginBar).prop('cancel');
    cancelFunc();
    assert.strictEqual(wrapper.state().loginBarChoice, null);

    const loginButton = wrapper.find('.login-toggle');
    loginButton.simulate('click');
    const cancelFunc2 = wrapper.find(LoginBar).prop('cancel');
    cancelFunc2();
    assert.strictEqual(wrapper.state().loginBarChoice, null);
  });

  it('calls to logout when selected', () => {
    const logout = sinon.spy();
    const wrapper = shallow(<Navbar logout={logout} metadata={{}}/>);

    const logoutButton = wrapper.find('.logout');
    logoutButton.simulate('click');

    assert(logout.calledOnce);
  });
});
