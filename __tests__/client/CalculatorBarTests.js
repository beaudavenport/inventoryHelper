import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import CalculatorBar from '../../src/client/CalculatorBar';

describe('CalculatorBar', () => {
  it('displays entry row with container options from store', () => {
    const container1 = {_id: 78, category: 'container', name: 'foo', weight: 89};
    const container2 = {_id: 67, category: 'container', name: 'orange', weight: 34};

    const mockStore = configureStore()({inventory: [container1, container2]});
    const wrapper = shallow(<CalculatorBar store={mockStore}/>);

    const options = wrapper.dive().find('option');
    assert.deepEqual(options.at(0).prop('value'), container1.weight);
    assert.deepEqual(options.at(0).text(), container1.name);
    assert.deepEqual(options.at(1).prop('value'), container2.weight);
    assert.deepEqual(options.at(1).text(), container2.name);
  });
});
