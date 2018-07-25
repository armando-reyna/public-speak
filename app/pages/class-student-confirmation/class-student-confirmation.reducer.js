import * as ACTION from './class-student-confirmation.types';

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
 
const classStudentConfirmation = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      state = { ...state, reasonsForAbsence: action.result.data.result.reasonsForAbsence, loading: false, error: null };
    break;
    case ACTION.SET_CLASS:
    let data = action.item.class,
      absentStudents = [];
      for (let s in data.students) {
        if (!data.students[s].isPresent) {
          absentStudents.push({
            ...data.students[s],
            index: s
          });
        }
      }
      state = { ...state, data, skipEvaluation: action.item.skipEvaluation, absentStudents, loading: false, error: null };
      if (action.item.form) {
        state.form = action.item.form;
      } else {
        if (state.data.classTime)
          state.form.duration = state.data.classTime;
        else
          state.form.isCancelled = true;
        state.form.attendance = state.data.students;
        state.form.endTime = moment().format('YYYY-MM-DD hh:mm:ss');
      }
    break;
    case ACTION.UPDATE_STUDENT:
      if (action.state) {
        state.showReasons = false;
        state.form.attendance[action.index].isPresent = true;
        state.form.attendance[action.index].attendanceAtFinishToClass = true;
        state.form.attendance[action.index].reasonForAbsence = null;
      } else {
        state.showReasons = true;
        state.form.attendance[action.index].isPresent = false;
        state.form.attendance[action.index].attendanceAtFinishToClass = false;
        state.form.attendance[action.index].reasonForAbsence = action.reason;
      }
      if (
        state.form.attendance[action.index].attendanceAtFinishToClass
        ||
        !state.form.attendance[action.index].attendanceAtFinishToClass && state.form.attendance[action.index].reasonForAbsence
      ) {
        state.form.valid = true;
      } else {
        state.form.valid = false;
      }
    break;
    case ACTION.NEXT_STUDENT:
      state.currentStudent++;
      state.form.valid = false;
      state.showReasons = false;
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

export default classStudentConfirmation;