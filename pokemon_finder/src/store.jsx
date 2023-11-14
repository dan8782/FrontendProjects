import { configureStore } from '@reduxjs/toolkit'
import pokemonsReducer from './themeSlice'

export default configureStore({
  reducer: {
    theme: pokemonsReducer,
  }
})