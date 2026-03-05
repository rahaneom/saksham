import { createSlice } from "@reduxjs/toolkit";

const resourceSlice = createSlice({
  name: "resources",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setResources: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setResources, setLoading } = resourceSlice.actions;
export default resourceSlice.reducer;