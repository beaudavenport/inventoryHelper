import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Navbar from '../../src/client/Navbar';

describe('Navbar', () => {
  it('renders default title if no current collection chosen', () => {
    const wrapper = shallow(<Navbar />);

    const collectionName = wrapper.find('.collection-name');
    assert.strictEqual(collectionName.text(), 'New Inventory');
  });

  it('displays login/create bar when selected', () => {
    const wrapper = shallow(<Navbar />);

    const loginButton = wrapper.find('.login-toggle');
    loginButton.simulate('click');

    const loginBar = wrapper.find('.login-bar');
    assert(loginBar);
  });
});
