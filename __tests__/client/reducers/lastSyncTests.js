import mocha from 'mocha';
import assert from 'assert';
import lastSync, { sync } from '../../../src/client/reducers/lastSync';

describe('lastSync reducer', () => {
  describe('sync', () => {
    it('should call to save all', () => {
      assert.deepEqual(sync(), { action: 'SAVE_ALL' });
    });

    it('should update lastSync on SAVE_SUCCESSFUL', () => {
      const saveSuccessful = { type: 'SAVE_SUCCESSFUL', payload: { lastSync: { lastSync: 'potatoTime' } } };
      const result = lastSync({ lastSync: 'never'}, saveSuccessful);

      assert.deepEqual(result, { lastSync: 'potatoTime' });
    });
  });
});
