import * as ACTION from './class-in-progress.types';
import { classService } from '../../services/class.service';

import moment from 'moment';

let getPosition = (callback, then) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      callback = callback(position)
      if (callback) {
        callback.then(data => {
          resolve(data);
          then(data);
        }, err => {
          reject(err);
        });
      } else {
        resolve(position);
      }
    }, err => {
      reject({
        response: {
          data: {
            message: err.message
          }
        }
      });
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 });
  })
};
export function setClass(item) {
  return {
    type: ACTION.SET_CLASS,
    item
  };
}
export function hasArrived(classData) {
  return {
    types: [
      ACTION.LOADING,
      ACTION.RECEIVED,
      ACTION.ERROR,
    ],
    promise: getPosition(position => {
      return classService.classArrived(classData.id, {
          "arrivalTime": moment().format('YYYY-MM-DD HH:mm:ss'),
          "latitude": position.coords.latitude,
          "longitude": position.coords.longitude
      });
    }, () => {
      classService.checkIn(classData);
    })
  };
}
export function hideLoader(){
  return dispatch => dispatch({type: ACTION.HIDE_LOADER});
}
export function resume() {
  return { type: ACTION.START }
}
export function reset(){
  return dispatch => dispatch({type: ACTION.RESET});
}
export function startClass(classData) {
  return dispatch => {
    // TODO: probar resume
    console.log(classService.current(), classData);
    if (!classService.current() || classService.current().id !== classData.id) {
      return getPosition(position => {
        return classService.started(classData.id, {
          "startTime": moment().format('YYYY-MM-DD HH:mm:ss'),
          "latitude": position.coords.latitude,
          "longitude": position.coords.longitude
        });
      }, () => {
        classService.timer(classData).subscribe(res => {
          if (res.type === 'tick') {
            dispatch({
              type: ACTION.TICK,
              time: res.value
            });
          } else {
            dispatch({
              type: ACTION.FINISHSUCCESSFULLY
            });
          }
        });
        dispatch({type: ACTION.START});
      }).then(data => {}, err => {
        dispatch({
          type: ACTION.ERROR,
          error: err
        });
      }); 
    } else {
      dispatch({type: ACTION.START});
    }
  }
}
export function assistance(index, state) {
  return dispatch => {
    dispatch({
      type: ACTION.ASSISTANCE,
      student: index,
      assistance: state
    });
  }
}