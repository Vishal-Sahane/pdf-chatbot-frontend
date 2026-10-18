import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        role: 'user',
        text: action.payload,
      })
    },
    addBotMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        role: 'bot',
        text: action.payload,
      })
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearChat: (state) => {
      return initialState
    },
  },
})

export const {
  addUserMessage,
  addBotMessage,
  setLoading,
  setError,
  clearChat,
} = chatSlice.actions

export default chatSlice.reducer