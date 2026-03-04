import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* =========================
   FETCH POSTS
========================= */
export const fetchPosts = createAsyncThunk(
  "forum/fetchPosts",
  async ({ page = 0, sortBy = "latest", tag = "" }, { rejectWithValue }) => {
    try {
      let url = `/forum/posts?page=${page}&size=5&sortBy=${sortBy}`;
      if (tag) url += `&tag=${tag}`;

      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching posts");
    }
  },
);

/* =========================
   REPORT
========================= */
export const reportPost = createAsyncThunk(
  "forum/reportPost",
  async (postId, { rejectWithValue }) => {
    try {
      await api.put(`/forum/report/${postId}`);
      return postId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Report failed");
    }
  },
);

/* =========================
   LIKE
========================= */
export const toggleLike = createAsyncThunk(
  "forum/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.put(`/forum/like/${postId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Like failed");
    }
  },
);

/* =========================
   FETCH COMMENTS
========================= */
export const fetchComments = createAsyncThunk(
  "forum/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/comments/${postId}`);
      return { postId, comments: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching comments");
    }
  },
);

/* =========================
   ADD COMMENT
========================= */
export const addComment = createAsyncThunk(
  "forum/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/comments/add/${postId}`, { content });
      return { postId, comment: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding comment");
    }
  },
);

export const editComment = createAsyncThunk(
  "forum/editComment",
  async ({ commentId, content, postId }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/comments/edit/${commentId}`, { content });
      return { postId, comment: res.data };
    } catch (err) {
      return rejectWithValue(
        "Error editing comment",
        err.response?.data || "Error editing comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "forum/deleteComment",
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/delete/${commentId}`);
      return { commentId, postId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

export const createPost = createAsyncThunk(
  "forum/createPost",
  async ({ content, tag }, { rejectWithValue }) => {
    try {
      const res = await api.post("/forum/create", { content, tag });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating post");
    }
  },
);

export const editPost = createAsyncThunk(
  "forum/editPost",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/forum/edit/${postId}`, { content });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Edit failed");
    }
  },
);

export const deletePost = createAsyncThunk(
  "forum/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/forum/delete/${postId}`);
      return postId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  posts: [],
  comments: {}, // { postId: { data: [], loading: false, error: null } }
  loading: false,
  error: null,
  page: 0,
  totalPages: 0,
  reportedPosts: {},
};

/* =========================
   SLICE
========================= */
const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== POSTS ===== */
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.page = action.meta.arg.page;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== REPORT ===== */
      .addCase(reportPost.fulfilled, (state, action) => {
        state.reportedPosts[action.payload] = true;
      })

      /* ===== LIKE ===== */
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.posts.findIndex((p) => p.id === updated.id);

        if (index !== -1) {
          state.posts[index] = updated;
        }
      })

      /* ===== COMMENTS FETCH ===== */
      // COMMENTS FETCH
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg;

        state.comments[postId] = {
          data: [],
          loading: true,
          error: null,
        };
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;

        state.comments[postId] = {
          data: comments,
          loading: false,
          error: null,
        };
      })

      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg;

        state.comments[postId] = {
          data: [],
          loading: false,
          error: action.payload,
        };
      })

      // ADD COMMENT
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        if (!state.comments[postId]) {
          state.comments[postId] = { data: [], loading: false };
        }

        state.comments[postId].data.unshift(comment);
      })

      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        const comments = state.comments[postId]?.data;

        if (comments) {
          const index = comments.findIndex((c) => c.id === comment.id);
          if (index !== -1) {
            comments[index] = comment;
          }
        }
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;

        const comments = state.comments[postId]?.data;

        if (comments) {
          state.comments[postId].data = comments.filter(
            (c) => c.id !== commentId,
          );
        }
      })

      .addCase(createPost.fulfilled, (state, action) => {
        // optional: push new post on top
        state.posts.unshift(action.payload);
      })

      .addCase(editPost.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.posts.findIndex((p) => p.id === updated.id);

        if (index !== -1) {
          state.posts[index] = updated;
        }
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;

        state.posts = state.posts.filter((p) => p.id !== postId);
      });
  },
});

export default forumSlice.reducer;
