import {configureStore} from '@reduxjs/toolkit';
import userTypee from '../Reducers/userType';

const myStore = configureStore({
  reducer: {
    userTypee,
  },
});

export default myStore;
