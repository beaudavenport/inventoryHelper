import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ContainerPage from '../../src/client/ContainerPage';
import ContainerRow from '../../src/client/ContainerRow';

describe('ContainerPage', () => {
  it('displays a row for each container with active row one currenty active', () => {
    const container1 = {_id: 'blah', name: 'potatosack', category: 'container', weight: 78.1};
    const container2 = {_id: 'blah2', name: 'things', category: 'container', weight: 3.2};
    const otherThing = {_id: 'ugh', category: 'someThing'};
    const mockStore = configureStore()({inventory: [container2, otherThing, container1]});

    const wrapper = shallow(<ContainerPage store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: container2._id});

    const containerRow = component.find(ContainerRow);
    assert.deepEqual(container2, containerRow.prop('container'));
    const inactiveRow = component.find('.inactive-row');
    assert.strictEqual(inactiveRow.find('td').at(0).text(), 'potatosack');
    assert.strictEqual(inactiveRow.find('td').at(1).text(), '78.10');
  });

  it('passes an updateContainer action to containerRow', () => {
    const container = {_id: 'blah', category: 'container'};
    const mockStore = configureStore()({inventory: [container]});
    const wrapper = shallow(<ContainerPage store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: container._id});

    const containerRow = component.find(ContainerRow);
    const updateContainer = containerRow.prop('updateContainer');
    updateContainer({_id: 'blah', name: 'potato'});

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.name, 'potato');
  });

  it('passes a flagForDeletion action to containerRow', () => {
    const container = {_id: 'blah', category: 'container'};
    const mockStore = configureStore()({inventory: [container]});
    const wrapper = shallow(<ContainerPage store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: container._id});

    const containerRow = component.find(ContainerRow);
    const flagForDeletion = containerRow.prop('flagForDeletion');
    flagForDeletion(container._id);

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.isDeleted, true);
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
