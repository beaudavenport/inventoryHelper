import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import BlendTable from '../../src/client/BlendTable';
import BlendRow from '../../src/client/BlendRow';

describe('BlendTable', () => {
  it('displays a blend row when there is one currently active blend', () => {
    const blend = {_id: 'blah', category: 'blend'};
    const mockStore = configureStore()({inventory: [blend]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: blend._id});

    const blendRow = component.find(BlendRow);
    assert.deepEqual(blend, blendRow.prop('blend'));
  });

  it('displays a normal blend row with values when blend is not active row', () => {
    const blend = {
      _id: 'blah',
      category: 'blend',
      name: 'foo',
      origin: 'blah',
      weight: 38.9,
    };
    const mockStore = configureStore()({inventory: [blend]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);

    const row = wrapper.dive().find('.inactive-row');
    assert.strictEqual(row.find('td').at(0).text(), 'foo, blah');
    assert.strictEqual(row.find('td').at(1).text(), '38.90');
    assert.strictEqual(row.find('td').at(2).text(), '38.90');
  });

  it('passes an updateBlend action to blendRow', () => {
    const blend = {_id: 'blah', category: 'blend'};
    const mockStore = configureStore()({inventory: [blend]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: blend._id});

    const blendRow = component.find(BlendRow);
    const updateBlend = blendRow.prop('updateBlend');
    updateBlend({_id: 'blah', name: 'potato'});

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.name, 'potato');
  });

  it('passes a flagForDeletion action to blendRow', () => {
    const blend = {_id: 'blah', category: 'blend'};
    const mockStore = configureStore()({inventory: [blend]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);
    const component = wrapper.dive();
    component.setState({activeRow: blend._id});

    const blendRow = component.find(BlendRow);
    const flagForDeletion = blendRow.prop('flagForDeletion');
    flagForDeletion(blend._id);

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'UPDATE_INVENTORY_ITEM');
    assert.strictEqual(action.payload._id, 'blah');
    assert.strictEqual(action.payload.isDeleted, true);
  });

  it('displays a row with an add blend button', () => {
    const mockStore = configureStore()({inventory: []});
    const wrapper = shallow(<BlendTable store={mockStore}/>);

    const newBlendButton = wrapper.dive().find('.add-blend');
    const addBlend = newBlendButton.prop('onClick');
    addBlend();

    const action = mockStore.getActions()[0];
    assert.strictEqual(action.type, 'ADD_INVENTORY_ITEM');
  });

  it('displays total for all blends', () => {
    const blend1 = {_id: 'stuff', category: 'blend', weight: 1.89};
    const blend2 = {_id: 'stuff', category: 'blend', weight: 2.11};
    const mockStore = configureStore()({inventory: [blend1, blend2]});
    const wrapper = shallow(<BlendTable store={mockStore}/>);

    const totalWeight = wrapper.dive().find('.total-blend-weight');

    assert.strictEqual(totalWeight.text(), '4.00');
  });
});
