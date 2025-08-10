import { createSlice } from "@reduxjs/toolkit"

interface UIState {
  isSearchModalOpen: boolean
  theme: "light" | "dark" | "system"
}

const initialState: UIState = {
  isSearchModalOpen: false,
  theme: "system",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSearchModal: (state) => {
      state.isSearchModalOpen = true
    },
    closeSearchModal: (state) => {
      state.isSearchModalOpen = false
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { openSearchModal, closeSearchModal, setTheme } = uiSlice.actions
export default uiSlice.reducer
