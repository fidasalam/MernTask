import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer, // Adding the authReducer to the Redux store under the 'auth' key
  },
});
