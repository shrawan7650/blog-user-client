import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BlogPost } from "@/types/blog"

interface PostsState {
  posts: BlogPost[]
  currentPage: number
  selectedCategory: string
  loading: boolean
}

const initialState: PostsState = {
  posts: [],
  currentPage: 1,
  selectedCategory: "all",
  loading: false,
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPosts, setCurrentPage, setSelectedCategory, setLoading } = postsSlice.actions
export default postsSlice.reducer
