const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  usertype: '',
};

const userTypee = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    userTypeFunction(state, action) {
      state.usertype = action.payload.usertype;
    },
  },
});

export const {userTypeFunction} = userTypee.actions;
export default userTypee.reducer;
