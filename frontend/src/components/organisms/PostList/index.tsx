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
  onToggleLike?: (next: boolean) => void;
};

export type PostListProps = {
  posts: Post[];
  loading?: boolean;
  onOpenPost?: (id: string) => void;
};

// Composant PostList : affiche une liste de posts ou des messages selon l'état
const PostList = ({ posts, loading = false, onOpenPost }: PostListProps) => {
  // Affiche un spinner de chargement si loading est true
  if (loading) {
    return (
      <div className="post-list post-list--center" role="status">
        <Spinner size="md" />
        <p className="post-list__muted">Chargement des posts...</p>
      </div>
    );
  }

  // Affiche un message si aucun post n'est présent
  if (posts.length === 0) {
    return (
      <div className="post-list post-list--empty">
        <div className="post-list__empty-icon">📝</div>
        <p className="post-list__empty-title">Aucun post pour l'instant</p>
        <p className="post-list__muted">
          Soyez le premier à créer un post et à partager vos idées !
        </p>
      </div>
    );
  }

  // Affiche la liste des posts
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
          onToggleLike={p.onToggleLike}
          isAuthor={p.isAuthor}
          onEdit={p.onEdit}
          onDelete={p.onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;