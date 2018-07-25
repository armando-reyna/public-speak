import * as ACTION from "./dashboard.types";

import { classService } from '../../services/class.service';

const dataState = {
    loading: false,
    error: null,
    data: null,
    freeDay: false,
    teacherBusy: false,
    classInProgress: null
};
 
const dashboard = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      let list = classService.complete(action.result.data.result);
      state = { ...state, data: list['data'], freeDay: list['freeDay'], teacherBusy: list['teacherBusy'], classInProgress: list['classInProgress'], loading: false, error: null };
    break;
    case ACTION.ERROR:
      state = { ...state, loading: false, data: null, error: action.error.response.data };
    break;
    case ACTION.RESET:
      state = dataState;
    break;
  }
  return state;
};

export default dashboard;