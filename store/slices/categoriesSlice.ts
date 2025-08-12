// categoriesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesService } from "@/services/categoriesService";
import type { Category } from "@/types/blog";
import { RootState } from "../store";


export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>(
  "categories/fetchCategories",
  async () => {
    // Always fetch fresh categories (you can cache if you want)
    return await categoriesService.getCategories();
  },
  {
    // This condition function prevents dispatch if already loaded
    condition: (_, { getState }) => {
      const { categories } = getState();
      // If categories already loaded, skip thunk dispatch
      if (categories.items.length > 0) {
        return false;
      }
      return true;
    },
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
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categoriesSlice.reducer;
