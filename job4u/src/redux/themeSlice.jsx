import { createSlice } from '@reduxjs/toolkit'

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

const initialState = createInitialState();

function createInitialState() {
    return {
        userRole: getCookie('userRole') || null,
        userId: getCookie('userID') || null,
    }
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserRole: (state, action) => {
            state.userRole = action.payload;
          },
          setUserId: (state, action) => {
            state.userId = action.payload;
          },
    }
})

export const { setUserRole, setUserId } = AuthSlice.actions;

export default AuthSlice.reducer