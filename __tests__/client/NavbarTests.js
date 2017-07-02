import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import Navbar from '../../src/client/Navbar';

describe('Navbar', () => {
  it('renders default title if not logged in', () => {
    const mockStore = configureStore()({metadata: {}});
    const wrapper = shallow(<Navbar store={mockStore} />);

    const collectionName = wrapper.dive().find('.collection-name');
    assert.strictEqual(collectionName.text(), 'New Inventory');
  });

  it('renders collection name if logged in', () => {
    const mockStore = configureStore()({metadata: {collectionName: 'GreatBigPotatoes'}});
    const wrapper = shallow(<Navbar store={mockStore} />);

    const collectionName = wrapper.dive().find('.collection-name');
    assert.strictEqual(collectionName.text(), 'GreatBigPotatoes');
  });

  it('displays login/create bar when selected', () => {
    const mockStore = configureStore()({metadata: {}});
    const wrapper = shallow(<Navbar store={mockStore}/>);

    const loginButton = wrapper.dive().find('.login-toggle');
    loginButton.simulate('click');

    const loginBar = wrapper.dive().find('.login-bar');
    assert(loginBar);
  });
});
