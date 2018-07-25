import * as ACTION from './class-review.types';
import { classService } from '../../services/class.service';

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
export function finish(id, data) {
  delete data.valid;
  return {
    types: [
      ACTION.LOADING,
      ACTION.FINISH_SUCCESS,
      ACTION.ERROR,
    ],
    promise: classService.finish(id, data, true)
  };
}
export function setClass(item) {
  return {
    type: ACTION.SET_CLASS,
    item
  };
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