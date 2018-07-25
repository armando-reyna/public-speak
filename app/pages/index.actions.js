import * as ACTION from './index.types';
import { userService } from '../services/user.service';

export function checkSession() {
    return (dispatch) => {
        return userService.checkSession().then(data => {
            dispatch({type: ACTION.AVAILABLE});
            return data;
        }, err => {
            dispatch({type: ACTION.UNAVAILABLE});
        });
    };
}
