import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    backgroundImage: undefined
  },
  reducers: {
    setBackgroundImage: (state, action) => {
      state.backgroundImage = action.payload
    }
  }
})

export const { setBackgroundImage } = appSlice.actions

export function getBackgroundImage(state: { app: { backgroundImage: string } }): string {
  return state.app.backgroundImage
}

export default appSlice.reducer
