import { configureStore } from '@reduxjs/toolkit'
import pdfReducer from '../features/pdf/pdfSlice'
import chatReducer from '../features/chat/chatSlice'

const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    chat: chatReducer,
  },
})

export default store