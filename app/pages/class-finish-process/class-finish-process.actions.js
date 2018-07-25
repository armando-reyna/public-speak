import * as ACTION from './class-finish-process.types';
import { classService } from '../../services/class.service';


export function setClass(item) {
  return {
    type: ACTION.SET_CLASS,
    item
  };
}
export function updateProperty(property, value) {
  return dispatch => {
    dispatch({
      type: ACTION.UPDATE_PROPERTY,
      property,
      value
    });
  }
}
export function getTypes() {
  return {
    types: [
      ACTION.LOADING,
      ACTION.RECEIVED,
      ACTION.ERROR,
    ],
    promise: classService.cancellationTypes()
  };
}
export function finish(id, data, stopTimer) {
  delete data.valid;
  return {
    types: [
      ACTION.LOADING,
      ACTION.FINISH_SUCCESS,
      ACTION.ERROR,
    ],
    promise: classService.finish(id, data, stopTimer)
  };
}
export function continueFinish() {
  return {
    type: ACTION.CONTINUE
  }
}
export function reset() {
  return {
    type: ACTION.RESET
  }
}
export function hideLoader() {
  return {
    type: ACTION.HIDE_LOADER
  }
}