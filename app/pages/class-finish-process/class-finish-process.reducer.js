import * as ACTION from './class-finish-process.types';

import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')
 
const dataState = {
    loading: false,
    error: null,
    data: null,
    confirmed: false,
    cancellationTypes: null,
    absenceTypes: null,
    reasonsForAbsence: null,
    finishSucess: false,
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
 
const classFinishProcess = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.FINISH_SUCCESS: 
      state = { ...state, finishSucess: true }
    break;
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      state = { ...state, finishTypes: action.result.data.result.finishTypes, cancellationTypes: action.result.data.result.cancellationTypes, reasonsForAbsence: action.result.data.result.reasonsForAbsence, loading: false, error: null };
    break;
    case ACTION.SET_CLASS:
      state = { ...state, data: action.item, loading: false, error: null };
      if (state.data.classTime)
        state.form.duration = state.data.classTime;
      else
        state.form.isCancelled = true;
      state.form.attendance = state.data.students;
      state.form.endTime = moment().format('YYYY-MM-DD hh:mm:ss');
    break;
    case ACTION.UPDATE_PROPERTY:
      if (action.property === 'cancellationTypeID') {
        state.form.reasonIDForCancellation = null;
      }
      state = { ...state, form:{ ...state.form, [action.property]: action.value }};
      if (
        (state.form.cancellationTypeID && state.form.reasonIDForCancellation !== null)
        ||
        ((state.form.cancellationTypeID !== 'C+' && state.form.cancellationTypeID !== 'C-') && state.form.reasonIDForCancellation === null)
      ) {
        state.form.valid = true;
      } else {
        state.form.valid = false;
      }
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
    case ACTION.CONTINUE:
      state = {
        ...state,
        confirmed: true,
      };
    break;
  }
  return state;
};

export default classFinishProcess;