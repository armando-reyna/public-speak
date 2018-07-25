import * as ACTION from './class-detail.types';
import { classService } from '../../services/class.service';

export function getClass(id) {
  return {
    types: [
      ACTION.LOADING,
      ACTION.RECEIVED,
      ACTION.ERROR,
    ],
    promise: classService.getByID(id)
  };
}