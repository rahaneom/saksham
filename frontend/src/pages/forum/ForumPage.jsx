import { useState, useEffect } from "react";
import { PenSquare } from "lucide-react";
import { Users } from "lucide-react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PostList from "../../components/forum/PostList";
import {
  fetchPosts,
  reportPost,
  toggleLike,
  createPost,
  editPost,
  deletePost,
} from "../../features/forum/forumSlice";

const ForumPage = () => {
  const dispatch = useDispatch();

  const [toast, setToast] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("");

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !newPostTag) return;

    dispatch(
      createPost({
        content: newPostContent,
        tag: newPostTag,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setNewPostContent("");
        setNewPostTag("");

        document.getElementById("create_post_modal").close();

        dispatch(fetchPosts({ page: 0 }));
      }
    });
  };

  const handleEditPost = (postId, content) => {
    dispatch(editPost({ postId, content }));
  };

  const handleReport = (postId) => {
    if (reportedPosts[postId]) {
      setToast("Already reported");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    dispatch(reportPost(postId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setToast("Post reported successfully");
      }

      setTimeout(() => setToast(""), 2000);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Please login first");
      return;
    }

    dispatch(fetchPosts({ page: 0 }));
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  const { posts, loading, error, page, totalPages, reportedPosts } =
    useSelector((state) => state.forum);

  const handleNext = () => {
    if (page < totalPages - 1) {
      dispatch(fetchPosts({ page: page + 1 }));
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      dispatch(fetchPosts({ page: page - 1 }));
    }
  };

  return (
    // <div className="max-w-2xl p-4 mx-auto">

    <div className="max-w-3xl px-4 py-6 mx-auto">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3">
          <Users size={32} className="text-emerald-400" />

          <h1 className="text-3xl font-bold tracking-wide text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
            Anonymous Peer Forum
          </h1>
        </div>

        <p className="mt-3 text-base text-gray-300">
          A safe space to share your thoughts, struggles, and experiences
          openly.
        </p>
      </div>

      {error && <p>{error}</p>}

      <div className="flex items-center justify-between mb-4">
        {/* <h1 className="text-2xl font-bold">Forum</h1> */}

        <select
          disabled={loading}
          className={`p-3 select select-bordered select-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onChange={(e) =>
            dispatch(fetchPosts({ page: 0, sortBy: e.target.value }))
          }
        >
          <option value="latest">Latest</option>
          <option value="likes">Most Liked</option>
        </select>

        <select
          disabled={loading}
          className={`p-3 select select-bordered select-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onChange={(e) =>
            dispatch(fetchPosts({ page: 0, sortBy: e.target.value }))
          }
        >
          <option value="">All Tags</option>
          <option value="STRESS">Stress</option>
          <option value="EXAMS">Exams</option>
          <option value="PLACEMENTS">Placements</option>
          <option value="RELATIONSHIPS">Relationships</option>
          <option value="MOTIVATION">Motivation</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : posts.length === 0 ? (
        <p className="py-10 text-center opacity-60"></p>
      ) : (
        <PostList
          posts={posts}
          onReport={handleReport}
          onLike={handleLike}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          reportedPosts={reportedPosts}
        />
      )}

      {toast && (
        <div className="toast toast-top toast-end">
          <div
            className={`alert ${
              toast.includes("success") ? "alert-success" : "alert-warning"
            }`}
          >
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="gap-2 join">
          {/* Previous */}
          <button
            className="px-3 py-3 join-item btn btn-md"
            onClick={handlePrev}
            disabled={page === 0 || loading}
          >
            «
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              disabled={loading}
              className={`join-item btn btn-md p-3 ${
                i === page ? "btn-active" : ""
              }`}
              onClick={() => dispatch(fetchPosts({ page: i }))}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            className="p-3 join-item btn btn-md border-stone-300"
            onClick={handleNext}
            disabled={page === totalPages - 1 || loading}
          >
            »
          </button>
        </div>
      </div>

      {/* Floating Create Post Button */}
      <div
        className="text-slate-50 tooltip tooltip-left"
        data-tip="Create Post"
      >
        <button
          className="fixed z-50 transition-all shadow-2xl btn btn-primary btn-circle bottom-10 right-10 bg-emerald-700 border-emerald-900 hover:scale-110"
          onClick={() =>
            document.getElementById("create_post_modal").showModal()
          }
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* CREATE POST MODAL */}
      <dialog
        id="create_post_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create Post</h3>

          {/* CONTENT INPUT */}
          <textarea
            className="w-full p-3 mt-3 textarea textarea-bordered"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>

          {/* TAG SELECT */}
          <select
            className="w-full p-2 mt-3 select select-bordered"
            value={newPostTag}
            onChange={(e) => setNewPostTag(e.target.value)}
          >
            <option value="">Select Tag</option>
            <option value="STRESS">Stress</option>
            <option value="EXAMS">Exams</option>
            <option value="PLACEMENTS">Placements</option>
            <option value="RELATIONSHIPS">Relationships</option>
            <option value="MOTIVATION">Motivation</option>
          </select>

          {/* ACTIONS */}
          <div className="modal-action">
            <form method="dialog">
              <button className="p-3 btn">Cancel</button>
            </form>

            <button className="p-3 btn btn-primary" onClick={handleCreatePost}>
              Post
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ForumPage;
