import { configureStore } from '@reduxjs/toolkit'
import authReducer from './themeSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
  }
})