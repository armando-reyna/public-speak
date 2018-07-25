import * as ACTION from './dashboard.types';
import { classService } from '../../services/class.service';

export function getClasses() {
  return {
    types: [
      ACTION.LOADING,
      ACTION.RECEIVED,
      ACTION.ERROR,
    ],
    promise: classService.fetchClasses()
  };
}
export function reset() {
  return {
    type: ACTION.RESET
  }
}