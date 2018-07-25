import * as ACTION from './class-review.types';

import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')
 
const dataState = {
    loading: false,
    error: null,
    data: null,
    reasonsForAbsence: null,
    currentStudent: 0,
    absentStudents: null,
    showReasons: false,
    skipEvaluation: false,
    form: {
      duration: 0,
      endTime: null,
      latitude: null,
      longitude: null,
      isCancelled: false,
      cancellationTypeID: null,
      reasonIDForCancellation: null,
      attendance: null,
      valid: false
    }
};
 
const classReview = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      state = { ...state, reasonsForAbsence: action.result.data.result.reasonsForAbsence, loading: false, error: null };
    break;
    case ACTION.SET_CLASS:
      state = { ...state, data: action.item.class, form: action.item.form, loading: false, error: null };
    break;
    case ACTION.ERROR:
      state = { ...state, loading: false, error: action.error.response.data };
    break;
    case ACTION.RESET:
      state = dataState;
    break;
    case ACTION.HIDE_LOADER:
      state = { ...state, loading: false, error: null }
    break;
  }
  return state;
};

export default classReview;