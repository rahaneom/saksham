import PostCard from "./PostCard";

const PostList = ({
  posts = [],
  onReport,
  onLike,
  onEditPost,
  onDeletePost,
  reportedPosts = {},
}) => {
  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onReport={onReport}
          onLike={onLike}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          isReported={reportedPosts[post.id]}
        />
      ))}
    </div>
  );
};

export default PostList;
