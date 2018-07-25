import * as actions from './login.actions';
import * as types from './login.types';
describe('LOGIN', () => {
  describe('PAGE ACTIONS', () => {
    it('should update form property', () => {
      const value = 'scabral@palo-it.com',
      property = 'email';
      const expectedAction = {
        type: types.UPDATE_PROPERTY,
        property,
        value
      }
      expect(actions.updateProperty(property, value)).toEqual(expectedAction)
    });
  })
});