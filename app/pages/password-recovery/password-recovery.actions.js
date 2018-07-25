import * as ACTION from './password-recovery.types';
import { userService } from '../../services/user.service';

export function resetPasswordAction(username) {
    return {
      types: [
        ACTION.LOADING,
        ACTION.RECEIVED,
        ACTION.ERROR,
      ],
      promise: userService.resetPassword(username)
    };
}

export function hideLoader(){
  return dispatch => dispatch({type: ACTION.RESET});
}

export function updateProperty(property, value) {
  return {
    type: ACTION.UPDATE_PROPERTY,
    property,
    value
  };
}
