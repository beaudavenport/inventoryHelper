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

  it('displays login/create bar when selected', () => {
    const loginSpy = sinon.spy();
    const wrapper = shallow(<Navbar login={loginSpy} metadata={{}}/>);

    const loginButton = wrapper.find('.login-toggle');
    loginButton.simulate('click');

    const loginBar = wrapper.find(LoginBar);
    assert.strictEqual(loginBar.prop('login'), loginSpy);
  });
});
