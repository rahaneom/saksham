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
import ThemeToggle from "../../components/common/ThemeToggle";

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
    <div className="max-w-3xl px-4 py-6 mx-auto">
      <div className="mb-10 text-center">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Users size={32} className="text-primary" />

          <h1 className="text-3xl font-bold tracking-wide text-base-content">
            Anonymous Peer Forum
          </h1>
        </div>

        <p className="mt-3 text-base text-base-content/70">
          A safe space to share your thoughts, struggles, and experiences
          openly.
        </p>
      </div>

      {error && <p className="text-error text-center mb-4">{error}</p>}

      <div className="card bg-base-200 mb-6">
        <div className="card-body p-5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select
              disabled={loading}
              className={`p-3 select select-bordered select-md w-40 shadow-lg border-gray-700 ${
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
              className={`p-3 select select-bordered select-md w-40 shadow-lg border-gray-700 ${
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
      ) : posts.length === 0 ? (
        <p className="py-10 text-center text-base-content/60">
          {" "}
          No Posts Available.
        </p>
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
      <div className="flex justify-center mt-8">
        <div className="join shadow">
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
                i === page ? "btn-active btn-primary" : ""
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
      {/* <div
        className="tooltip tooltip-left fixed bottom-10 right-10 z-50"
        data-tip="Create Post"
      > */}
      <button
        className="fixed z-50 transition-transform shadow-2xl btn btn-primary btn-circle bottom-10 right-10 hover:scale-110 active:scale-95 ring-2 ring-primary-200"
        onClick={() => document.getElementById("create_post_modal").showModal()}
      >
        <Plus size={24} />
      </button>
      {/* </div> */}

      {/* CREATE POST MODAL */}
      <dialog
        id="create_post_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold text-base-content">Create Post</h3>

          {/* CONTENT INPUT */}
          <textarea
            className="w-full p-3 mt-4 textarea textarea-bordered"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>

          {/* TAG SELECT */}
          <select
            className="w-full p-2 mt-4 select select-bordered"
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
