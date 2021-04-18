import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '@/store/type'

const initialState: AppState = {
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  }
})


export default appSlice.reducer
