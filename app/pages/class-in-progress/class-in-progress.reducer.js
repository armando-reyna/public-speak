import * as ACTION from "./class-in-progress.types";
 
import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')

const dataState = {
    loading: false,
    error: null,
    data: null,
    started: false,
    time: 0,
    validFinish: false
};
 
const classInProgress = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.SET_CLASS:
      state = { ...state, data: action.item, loading: false, error: null };
    break;
    case ACTION.ERROR:
      state = { ...state, loading: false, error: action.error.response.data };
    break;
    case ACTION.RESET:
      state = dataState;
    break;
    case ACTION.HIDE_LOADER:
      state = {
        ...state,
        error: null
      };
    break;
    case ACTION.START:
      state = {
        ...state,
        time: 0,
        started: true
      };
    break;
    case ACTION.TICK:
      state = {
        ...state,
        time: action.time,
      };
    break;
    case ACTION.FINISHSUCCESSFULLY:
      state = { ...state, validFinish: true }
    break;
    case ACTION.ASSISTANCE:
      if (action.assistance) {
        let currentTime = moment();
        state.data['students'][action.student].isPresent = true;
        state.data['students'][action.student].attendanceAtFinishToClass = false;
        state.data['students'][action.student].attendanceTiming = currentTime.valueOf();
        state.data['students'][action.student]['assistance'] = {
          date: currentTime.valueOf(),
          time: currentTime.format('hh:mm A'),
          timerTime: state.time
        }
      } else {
        state.data['students'][action.student].isPresent = false;
        delete state.data['students'][action.student].assistance;
        delete state.data['students'][action.student].attendanceTiming;
      }
    break;
  }
  if (state.data) {
    state.data.needConfirmation = false;
    for (let student of state.data['students']) {
      if (!student.isPresent) {
        state.data.needConfirmation = true;
      }
    }
  }
  return state;
};

export default classInProgress;