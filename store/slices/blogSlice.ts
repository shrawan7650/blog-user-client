import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface BlogState {
  likes: Record<string, number>
  userLikes: Record<string, boolean>
}

const initialState: BlogState = {
  likes: {},
  userLikes: {},
}

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setLikes: (state, action: PayloadAction<{ slug: string; count: number }>) => {
      state.likes[action.payload.slug] = action.payload.count
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const slug = action.payload
      const currentlyLiked = state.userLikes[slug] || false
      state.userLikes[slug] = !currentlyLiked

      if (currentlyLiked) {
        state.likes[slug] = (state.likes[slug] || 0) - 1
      } else {
        state.likes[slug] = (state.likes[slug] || 0) + 1
      }
    },
  },
})

export const { setLikes, toggleLike } = blogSlice.actions
export default blogSlice.reducer
