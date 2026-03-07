import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import { Flag, Heart, MessageCircle } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
  fetchComments,
  addComment,
  editComment,
  deleteComment,
} from "../../features/forum/forumSlice";
import { forumToast } from "../../util/toast";

function PostCard({
  post,
  onReport,
  onLike,
  onEditPost,
  onDeletePost,
  isReported,
}) {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostText, setEditPostText] = useState(post.content);
  const [deletePostId, setDeletePostId] = useState(null);

  const MAX_LENGTH = 120;
  const isLong = post.content.length > MAX_LENGTH;

  const tagStyles = {
    STRESS: "badge-warning",
    EXAMS: "badge-info",
    PLACEMENTS: "badge-success",
    RELATIONSHIPS: "badge-secondary",
    MOTIVATION: "badge-accent",
  };

  const [commentText, setCommentText] = useState("");

  const commentsState = useSelector((state) => state.forum.comments[post.id]);

  // HANDLE TOGGLE COMMENTS
  const handleToggleComments = () => {
    setShowComments(!showComments);

    if (!showComments) {
      dispatch(fetchComments(post.id)).then((res) => {
        if (res.meta.requestStatus === "rejected") {
          forumToast.fetchError(res.payload || "Error fetching comments");
        }
      });
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;

    dispatch(
      editComment({
        commentId,
        content: editText,
        postId: post.id,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        forumToast.editCommentSuccess();
        setEditingId(null);
        setEditText("");
      } else {
        forumToast.editCommentError(res.payload || "Error editing comment");
      }
    });
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ commentId, postId: post.id })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        forumToast.deleteCommentSuccess();
        setDeleteId(null);
        document.getElementById(`delete_modal_${post.id}`).close();
      } else {
        forumToast.deleteCommentError(res.payload || "Delete failed");
      }
    });
  };

  // HANDLE ADD COMMENT
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    dispatch(addComment({ postId: post.id, content: commentText })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        forumToast.addCommentSuccess();
        setCommentText("");
      } else {
        forumToast.addCommentError(res.payload || "Error adding comment");
      }
    });
  };

  return (
    <div className="w-full card bg-base-200 border border-base-300 shadow-lg hover:shadow-xl transition-all">
      <div className="p-6 rounded-lg card-body">
        {/* bg-gradient-to-tl from-slate-500 to-cyan-950 */}
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar avatar-placeholder">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-sm font-semibold">
                  {post.authorName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </div>

            <h2 className="text-base-content font-semibold">
              {post.authorName || "Unknown"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </span>

            {post.owner && (
              <>
                <button
                  className="btn btn-ghost btn-xs text-info"
                  onClick={() => setEditingPost(true)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => {
                    setDeletePostId(post.id);
                    document
                      .getElementById(`delete_post_modal_${post.id}`)
                      .showModal();
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAG */}
        <div className="mt-2">
          <span
            className={`badge badge-md italic ${
              tagStyles[post.tag] || "badge-neutral"
            } badge-soft`}
          >
            #{post.tag.toLowerCase()}
          </span>
        </div>

        {/* CONTENT */}
        {editingPost ? (
          <div className="mt-2 space-y-2">
            <textarea
              className="w-full p-2 rounded-md textarea textarea-bordered textarea-xl"
              value={editPostText}
              onChange={(e) => setEditPostText(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                className="p-4 mt-2 btn btn-xs btn-success"
                onClick={() => {
                  onEditPost(post.id, editPostText).then((updated) => {
                    if (updated) {
                      setEditingPost(false);
                    }
                  });
                }}
              >
                Save
              </button>

              <button
                className="p-4 mt-2 btn btn-xs btn-ghost"
                onClick={() => setEditingPost(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 whitespace-pre-wrap text-base-content">
              {expanded ? post.content : post.content.slice(0, MAX_LENGTH)}
              {isLong && !expanded && "..."}
            </p>

            {isLong && (
              <button
                className="text-xs text-info w-fit"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between pt-3 mt-4 border-t border-base-300">
          <div className="flex gap-6 text-sm">
            {/* LIKE */}
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => onLike(post.id)}
            >
              <Heart
                size={18}
                className={`${
                  post.likedByCurrentUser
                    ? "fill-red-500 text-red-500"
                    : "opacity-70"
                }`}
              />
              <span>{post.likesCount}</span>
            </div>

            {/* COMMENTS */}
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleToggleComments}
            >
              <MessageCircle size={18} />
              <span>{showComments ? "Hide" : "View"}</span>
            </div>
          </div>

          {/* REPORT */}
          <button
            className={`btn btn-ghost btn-xs ${
              isReported ? "opacity-40" : "text-error"
            }`}
            disabled={isReported}
            onClick={() => !isReported && onReport(post.id)}
          >
            <Flag size={16} />
          </button>
        </div>

        {/* COMMENTS SECTION */}
        {showComments && (
          <div className="mt-4 space-y-4">
            {/* INPUT BOX */}
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="avatar avatar-placeholder">
                <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold ">
                  {post.authorName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 p-5 input input-bordered input-md"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              {/* Button */}
              <button
                className="px-6 py-5 btn btn-md btn-primary bg-primary text-primary-content"
                onClick={handleAddComment}
              >
                Post
              </button>
            </div>

            {/* COMMENTS LIST */}
            {commentsState?.loading && (
              <span className="loading loading-bars loading-sm"></span>
            )}

            {commentsState?.data?.map((c) => (
              <div key={c.id} className="flex gap-3 p-4 rounded-lg bg-base-100">
                {/* Avatar */}
                <div className="flex-shrink-0 avatar avatar-placeholder">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-xs">
                      {c.authorName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-base-content">
                      {c.authorName || "Unknown"}
                    </span>

                    <span className="text-xs opacity-60">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* EDIT MODE */}
                  {editingId === c.id ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        className="w-full p-5 input input-sm input-bordered"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="p-5 btn btn-xs btn-success"
                        onClick={() => handleSaveEdit(c.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="mt-1 text-sm text-base-content">{c.content}</p>

                      {/* SHOW EDIT ONLY IF OWNER */}
                      {(c.isOwner || c.owner) && (
                        <div className="flex gap-3 mt-1 text-xs">
                          <button
                            className="text-info hover:underline"
                            onClick={() => handleEdit(c)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-error hover:underline"
                            onClick={() => {
                              setDeleteId(c.id);
                              document
                                .getElementById(`delete_modal_${post.id}`)
                                .showModal();
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  <span className="text-xs opacity-60">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <dialog
              id={`delete_modal_${post.id}`}
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="text-xl font-bold text-error">
                  Delete Comment?
                </h3>

                <p className="py-3 opacity-90">
                  This action cannot be undone.
                </p>

                <div className="modal-action">
                  {/* Cancel */}
                  <form method="dialog">
                    <button className="p-5 btn btn-md">Cancel</button>
                  </form>

                  {/* Confirm Delete */}
                  <button
                    className="p-5 btn btn-md btn-error"
                    onClick={() => handleDelete(deleteId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        )}
      </div>

      <dialog
        id={`delete_post_modal_${post.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-xl font-bold text-error">Delete Post?</h3>

          <p className="py-3 opacity-90">
            This action cannot be undone.
          </p>

          <div className="modal-action">
            {/* Cancel */}
            <form method="dialog">
              <button className="p-3 btn btn-md">Cancel</button>
            </form>

            {/* Confirm */}
            <button
              className="p-3 btn btn-md btn-error"
              onClick={() => {
                onDeletePost(deletePostId).then((deleted) => {
                  if (deleted) {
                    document.getElementById(`delete_post_modal_${post.id}`).close();
                  }
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PostCard;
