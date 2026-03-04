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
      dispatch(fetchComments(post.id));
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
    );

    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ commentId, postId: post.id }));
    setDeleteId(null);
    document.getElementById(`delete_modal_${post.id}`).close();
  };

  // HANDLE ADD COMMENT
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    dispatch(addComment({ postId: post.id, content: commentText }));
    setCommentText("");
  };

  return (
    <div className="w-full transition-all border shadow-lg card bg-base-200 border-base-300 hover:shadow-xl">
      <div className="p-6 rounded-lg card-body">
        {/* bg-gradient-to-tl from-slate-500 to-cyan-950 */}
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar avatar-placeholder">
              <div className="w-10 rounded-full bg-cyan-950 text-primary-content">
                <span className="text-sm font-semibold">
                  {post.authorName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </div>

            <h2 className="text-base font-semibold text-teal-100">
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
        <div className="flex mt-2">
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
                  onEditPost(post.id, editPostText);
                  setEditingPost(false);
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
        <div className="flex justify-between pt-3 mt-3 border-t border-base-200">
          <div className="flex gap-6 text-sm">
            {/* LIKE */}
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => onLike(post.id)}
            >
              <Heart
                size={18}
                className={`${
                  post.likedByCurrentUser ? "fill-red-500 text-red-500" : ""
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
              isReported ? "text-gray-400" : "text-error"
            }`}
            disabled={isReported}
            onClick={() => !isReported && onReport(post.id)}
          >
            <Flag size={16} />
          </button>
        </div>

        {/* 💬 COMMENTS SECTION */}
        {/* COMMENTS SECTION */}
        {showComments && (
          <div className="mt-4 space-y-4">
            {/* INPUT BOX */}
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-8 h-8 min-w-[32px] rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold ">
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
                className="px-6 py-5 btn btn-md btn-primary bg-cyan-950 "
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
              <div key={c.id} className="flex gap-2 p-3 rounded-lg bg-base-200">
                {/* Avatar */}
                <div className="flex-shrink-0 avatar avatar-placeholder">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-base-300 text-primary-content">
                    <span className="text-xs">
                      {c.authorName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {c.authorName || "Unknown"}
                    </span>

                    <span className="text-xs opacity-50">
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
                      <p className="mt-1 text-sm">{c.content}</p>

                      {/* SHOW EDIT ONLY IF OWNER */}
                      {(c.isOwner || c.owner) && (
                        <div className="flex gap-3 mt-1 text-xs">
                          <button
                            className="text-info"
                            onClick={() => handleEdit(c)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-error"
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

                <p className="py-3 text-base opacity-90">
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

          <p className="py-3 text-base opacity-90">
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
                onDeletePost(deletePostId);
                document.getElementById(`delete_post_modal_${post.id}`).close();
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
