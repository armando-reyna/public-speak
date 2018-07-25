import * as ACTION from "./change-password.types";
 
const dataState = {
    loading: false,
    error: null,
    data: null,
    form: {
      valid: false,
      password: null,
      repeatPassword: null,
      verificationCode: null,
      token: null
    }
};
 
const changePassword = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      state = { ...state, data: action.result.data.result, loading: false, error: null };
    break;
    case ACTION.TOKENRECEIVED:
      state = { ...state, form:{ ...state.form, token: action.result.data.result }, loading: false, error: null };
    break;
    case ACTION.ERROR:
      state = { ...state, loading: false, data: null, error: action.error.response.data };
    break;
    case ACTION.UPDATE_PROPERTY:
      state = { ...state, form:{ ...state.form, [action.property]: action.value }};
    break;
    case ACTION.RESET:
      state = {
        ...state,
        error: null
      };
    break;
  }
  if (state.form.token) {
    if (state.form.repeatPassword && state.form.password && state.form.repeatPassword === state.form.password) {
      state.form.valid = true;
    } else {
      state.form.valid = false;
    }
  } else {
    if (state.form.verificationCode) {
      state.form.valid = true;
    } else {
      state.form.valid = false;
    }
  }
  return state;
};

export default changePassword;