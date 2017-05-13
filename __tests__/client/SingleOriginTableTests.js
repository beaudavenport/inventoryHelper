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
    const singleOriginCoffee = {_id: 'blah'};
    const mockStore = configureStore()({singleOriginCoffees: [singleOriginCoffee]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const singleOriginRow = wrapper.dive().find(SingleOriginRow);
    assert.deepEqual(singleOriginCoffee, singleOriginRow.prop('singleOriginCoffee'));
  });

  it('passes an updateCoffee action to singleOriginRow', () => {
    const singleOriginCoffee = {_id: 'blah'};
    const mockStore = configureStore()({singleOriginCoffees: [singleOriginCoffee]});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const singleOriginRow = wrapper.dive().find(SingleOriginRow);
    const updateCoffee = singleOriginRow.prop('updateCoffee');
    updateCoffee({_id: 'blah', name: 'potato'});

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_COFFEE');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.name, 'potato');
  });

  it('displays a row with an add coffee button', () => {
    const mockStore = configureStore()({singleOriginCoffees: []});
    const wrapper = shallow(<SingleOriginTable store={mockStore}/>);

    const newCoffeeButton = wrapper.dive().find('.add-coffee');
    const addCoffee = newCoffeeButton.prop('onClick');
    addCoffee();

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'ADD_COFFEE');
  });
});
