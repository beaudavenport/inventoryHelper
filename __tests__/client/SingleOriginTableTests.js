import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
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
});
