import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ContainerPage from '../../src/client/ContainerPage';
import ContainerRow from '../../src/client/ContainerRow';

describe('ContainerPage', () => {
  it('displays a row for each container with name and tare weight', () => {
    const container1 = {_id: 'blah', category: 'container'};
    const container2 = {_id: 'blah2', category: 'container'};
    const otherThing = {_id: 'ugh', category: 'someThing'};
    const mockStore = configureStore()({inventory: [container2, otherThing, container1]});

    const wrapper = shallow(<ContainerPage store={mockStore}/>);

    const containerRows = wrapper.dive().find(ContainerRow);
    assert.deepEqual(container2, containerRows.at(0).prop('container'));
    assert.deepEqual(container1, containerRows.at(1).prop('container'));
  });

  it('passes an updateContainer action to containerRow', () => {
    const container = {_id: 'blah', category: 'container'};
    const mockStore = configureStore()({inventory: [container]});
    const wrapper = shallow(<ContainerPage store={mockStore}/>);

    const containerRow = wrapper.dive().find(ContainerRow);
    const updateContainer = containerRow.prop('updateContainer');
    updateContainer({_id: 'blah', name: 'potato'});

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.name, 'potato');
  });

  it('displays a row with an add container button', () => {
    const mockStore = configureStore()({inventory: []});
    const wrapper = shallow(<ContainerPage store={mockStore}/>);

    const newContainerButton = wrapper.dive().find('.add-container');
    const addContainer = newContainerButton.prop('onClick');
    addContainer();

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'ADD_INVENTORY_ITEM');
  });
});
