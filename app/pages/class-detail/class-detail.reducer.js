import * as ACTION from "./class-detail.types";
 
import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')

const dataState = {
    loading: false,
    error: null,
    data: null,
    teacherBusy: false,
    classInProgress: null
};
 
const classDetail = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      if (action.result) {
        state = { ...state, data: action.result.data, classInProgress: action.result.classInProgress, teacherBusy: action.result.teacherBusy, loading: false, error: null };
      }
    break;
    case ACTION.ERROR:
      state = { ...state, loading: false, data: null, error: action.error.response.data };
    break;
  }
  return state;
};

export default classDetail;