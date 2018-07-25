
import { combineReducers } from 'redux';
import index from './pages/index.reducer';
import login from './pages/login/login.reducer';
import dashboard from './pages/dashboard/dashboard.reducer';
import classDetail from './pages/class-detail/class-detail.reducer';
import classInProgress from './pages/class-in-progress/class-in-progress.reducer';
import classFinishProcess from './pages/class-finish-process/class-finish-process.reducer';
import classStudentConfirmation from './pages/class-student-confirmation/class-student-confirmation.reducer';
import classReview from './pages/class-review/class-review.reducer';
import passwordRecovery from './pages/password-recovery/password-recovery.reducer';
import changePassword from './pages/change-password/change-password.reducer';

 
const rootReducer = combineReducers({
    index,
    login,
    dashboard,
    classDetail,
    classInProgress,
    classFinishProcess,
    passwordRecovery,
    changePassword,
    classStudentConfirmation,
    classReview
});
 
export default rootReducer;