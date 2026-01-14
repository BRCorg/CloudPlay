import "./postList.scss";

import Spinner from "../../atoms/Spinner";
import PostCard from "../../molecules/PostCard";

export type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  image?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  liked?: boolean;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type PostListProps = {
  posts: Post[];
  loading?: boolean;
  onOpenPost?: (id: string) => void;
  onToggleLike?: (id: string, next: boolean) => void;
};

const PostList = ({ posts, loading = false, onOpenPost, onToggleLike }: PostListProps) => {
  if (loading) {
    return (
      <div className="post-list post-list--center" role="status">
        <Spinner size="md" />
        <p className="post-list__muted">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-list post-list--empty">
        <div className="post-list__empty-icon">📝</div>
        <p className="post-list__empty-title">No posts yet</p>
        <p className="post-list__muted">
          Be the first to create a post and share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((p) => (
        <PostCard
          key={p.id}
          title={p.title}
          content={p.content}
          author={p.author}
          image={p.image}
          likes={p.likes ?? 0}
          comments={p.comments ?? 0}
          timestamp={p.timestamp}
          liked={p.liked ?? false}
          onOpen={onOpenPost ? () => onOpenPost(p.id) : undefined}
          onToggleLike={onToggleLike ? (next) => onToggleLike(p.id, next) : undefined}
          isAuthor={p.isAuthor}
          onEdit={p.onEdit}
          onDelete={p.onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;