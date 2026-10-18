import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fileName: null,
  fileId: null,
  totalPages: null,
  isUploading: false,
  isUploaded: false,
  error: null,
}

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.isUploading = true
      state.error = null
    },
    uploadSuccess: (state, action) => {
      state.isUploading = false
      state.isUploaded = true
      state.fileName = action.payload.filename
      state.fileId = action.payload.file_id
      state.totalPages = action.payload.total_pages
    },
    uploadFailure: (state, action) => {
      state.isUploading = false
      state.error = action.payload
    },
    resetPdf: (state) => {
      return initialState
    },
  },
})

export const { uploadStart, uploadSuccess, uploadFailure, resetPdf } = pdfSlice.actions
export default pdfSlice.reducer