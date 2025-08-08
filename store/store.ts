
import { configureStore } from "@reduxjs/toolkit"
import postsSlice from "./slices/postsSlice"
import uiSlice from "./slices/uiSlice"
import blogSlice from "./slices/blogSlice"
import categoriesReducer from "./slices/categoriesSlice"

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    categories:categoriesReducer,
    ui: uiSlice,
    blog: blogSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
