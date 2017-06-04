import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import SingleOriginTable from '../../src/client/SingleOriginTable';
import SingleOriginRow from '../../src/client/SingleOriginRow';

describe('SingleOriginTable', () => {
  it('displays a single origin row when there is one single origin coffee', () => {
    const singleOriginCoffee = {_id: 'blah', category: 'coffee'};
    const mockStore = configureStore()({inventory: [singleOriginCoffee]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const singleOriginRow = wrapper.dive().find(SingleOriginRow);
    assert.deepEqual(singleOriginCoffee, singleOriginRow.prop('singleOriginCoffee'));
  });

  it('passes an updateCoffee action to singleOriginRow', () => {
    const singleOriginCoffee = {_id: 'blah', category: 'coffee'};
    const mockStore = configureStore()({inventory: [singleOriginCoffee]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const singleOriginRow = wrapper.dive().find(SingleOriginRow);
    const updateCoffee = singleOriginRow.prop('updateCoffee');
    updateCoffee({_id: 'blah', name: 'potato'});

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.name, 'potato');
  });

  it('passes a flagForDeletion action to singleOriginRow', () => {
    const singleOriginCoffee = {_id: 'blah', category: 'coffee'};
    const mockStore = configureStore()({inventory: [singleOriginCoffee]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const singleOriginRow = wrapper.dive().find(SingleOriginRow);
    const flagForDeletion = singleOriginRow.prop('flagForDeletion');
    flagForDeletion(singleOriginCoffee._id);

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.isDeleted, true);
  });

  it('displays a row with an add coffee button', () => {
    const mockStore = configureStore()({inventory: []});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const newCoffeeButton = wrapper.dive().find('.add-coffee');
    const addCoffee = newCoffeeButton.prop('onClick');
    addCoffee();

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'ADD_INVENTORY_ITEM');
  });

  it('displays total for all coffees', () => {
    const coffee1 = {_id: 'stuff', category: 'coffee', greenWeight: 5.00, roastedWeight: 1.09 };
    const coffee2 = {_id: 'stuff', category: 'coffee', greenWeight: 6.89, roastedWeight: 2.50};
    const mockStore = configureStore()({inventory: [coffee1, coffee2]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const totalGreenWeight = wrapper.dive().find('.total-green-weight');
    const totalRoastedWeight = wrapper.dive().find('.total-roasted-weight');
    const totalCoffeeWeight = wrapper.dive().find('.total-coffee-weight');

    assert.strictEqual(totalGreenWeight.text(), '11.89');
    assert.strictEqual(totalRoastedWeight.text(), '3.59');
    assert.strictEqual(totalCoffeeWeight.text(), '15.48');
  });
});
