import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import BlendTable from '../../src/client/BlendTable';
import BlendRow from '../../src/client/BlendRow';

describe('BlendTable', () => {
  it('displays a single origin row when there is one single origin coffee', () => {
    const blend = {_id: 'blah', category: 'blend'};
    const mockStore = configureStore()({inventory: [blend]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);

    const blendRow = wrapper.dive().find(BlendRow);
    assert.deepEqual(blend, blendRow.prop('blend'));
  });

  // it('passes an updateCoffee action to singleOriginRow', () => {
  //   const singleOriginCoffee = {_id: 'blah', category: 'coffee'};
  //   const mockStore = configureStore()({inventory: [singleOriginCoffee]});
  //   const wrapper = shallow(<SingleOriginTable store={mockStore}/>);
  //
  //   const singleOriginRow = wrapper.dive().find(SingleOriginRow);
  //   const updateCoffee = singleOriginRow.prop('updateCoffee');
  //   updateCoffee({_id: 'blah', name: 'potato'});
  //
  //   const action = mockStore.getActions()[0];
  //   assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
  //   assert.strictEqual(action.payload._id, 'blah');
  //   assert.strictEqual(action.payload.name, 'potato');
  // });
  //
  // it('displays a row with an add coffee button', () => {
  //   const mockStore = configureStore()({inventory: []});
  //   const wrapper = shallow(<SingleOriginTable store={mockStore}/>);
  //
  //   const newCoffeeButton = wrapper.dive().find('.add-coffee');
  //   const addCoffee = newCoffeeButton.prop('onClick');
  //   addCoffee();
  //
  //   const action = mockStore.getActions()[0];
  //   assert.strictEqual(action.type, 'ADD_INVENTORY_ITEM');
  // });
});
