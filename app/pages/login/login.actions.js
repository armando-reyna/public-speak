import * as ACTION from './login.types';
import { userService } from '../../services/user.service';

export function login(username, password) {
    return {
      types: [
        ACTION.LOADING,
        ACTION.RECEIVED,
        ACTION.ERROR,
      ],
      promise: userService.login(username, password)
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
