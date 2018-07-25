import * as ACTION from "./index.types";
 
const dataState = {
  session: null
};
 
const index = (state = dataState, action) => {
  switch (action.type) {
    case ACTION.AVAILABLE:
      state = { ...state, session: true };
    break;
    case ACTION.UNAVAILABLE:
      state = { ...state, session: false };
    break;
  }
  return state;
};

export default index;