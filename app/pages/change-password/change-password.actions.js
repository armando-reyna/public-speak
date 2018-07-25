import * as ACTION from './change-password.types';
import { userService } from '../../services/user.service';

export function verifyCode(code, email) {
  return {
    types: [
      ACTION.LOADING,
      ACTION.TOKENRECEIVED,
      ACTION.ERROR,
    ],
    promise: userService.verifyCode(code,email)
  };
}
export function changePassword(password, token) {
    return {
      types: [
        ACTION.LOADING,
        ACTION.RECEIVED,
        ACTION.ERROR,
      ],
      promise: userService.updatePassword(password, token)
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
