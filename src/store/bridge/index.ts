import { createSlice } from '@reduxjs/toolkit'
import { BridgeState, State } from '@/store/type'
import config from '@/config'

const initialState: BridgeState = {
  sourcePolyChainId: config.bridge.polyChains[0].polyChainId
}

export const bridgeSlice = createSlice({
  name: 'bridge',
  initialState,
  reducers: {
    setSourcePolyChainId: (state, action) => {
      state.sourcePolyChainId = action.payload
    }
  }
})

export function getSourcePolyChainId(state: State): number {
  return state.bridge.sourcePolyChainId
}

export const { setSourcePolyChainId } = bridgeSlice.actions

export default bridgeSlice.reducer
