// src/store/categoriesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesService } from "@/services/categoriesService";
import type { Category } from "@/types/blog";

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: any }
>(
  "categories/fetchCategories",
  async (_, { getState }) => {
    const { categories } = getState();

    // ✅ Agar state me pehle se data hai, Firebase/Service call skip karo
    if (categories.items.length > 0) {
      return categories.items;
    }

    return await categoriesService.getCategories();
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [] as Category[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categoriesSlice.reducer;
