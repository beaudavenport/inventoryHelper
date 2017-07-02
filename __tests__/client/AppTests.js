import React from 'react';
import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { App } from '../../src/client/App';

describe('App', () => {

  beforeEach(() => {
    if(global.sessionStorage) {
      global.sessionStorage.clear();
    } else {
      global.sessionStorage = {
        getItem: sinon.stub(),
        setItem: sinon.spy()
      };
    }
  });

  describe('componentDidMount', () => {
    it('checks for existing credentials', () => {
      const fetchAllItems = sinon.spy();
      global.sessionStorage.getItem.returns('some token');

      const testObject = new App({fetchAllItems});
      testObject.componentDidMount();

      assert(fetchAllItems.calledOnce);
    });
  });
});
