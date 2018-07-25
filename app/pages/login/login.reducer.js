import * as ACTION from "./login.types";
 
const dataState = {
    loading: false,
    error: null,
    data: null,
    form: {
      valid: false,
      email: null,
      password: null
    }
};
 
const login = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.LOADING:
      state = { ...state, loading: true, error: null};
    break;
    case ACTION.RECEIVED:
      state = { ...state, data: action.result.data.result, loading: false, error: null };
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
  if (state.form.email && state.form.password) {
    state.form.valid = true;
  } else {
    state.form.valid = false;
  }
  return state;
};

export default login;