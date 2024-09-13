import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'

export const store = configureStore({
    reducers: authReducer
})