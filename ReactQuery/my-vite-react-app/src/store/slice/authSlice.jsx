// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    name: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log('Action received in reducer:', action); // Log the action
      state.name = action.payload.name;
      state.token = action.payload.token;
      console.log('Updated state:', state); // Log the updated state
    },
    clearUser: (state) => {
      console.log('Clear user action received'); // Log the action
      state.name = null;
      state.token = null;
      console.log('Updated state:', state); // Log the updated state
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
