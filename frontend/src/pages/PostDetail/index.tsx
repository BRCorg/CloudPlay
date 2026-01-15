import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getComments, updateComment, deleteComment, toggleLikeComment } from "../../redux/comments/commentsSlice";
import { toggleLikePost, getPostById } from "../../redux/posts/postsSlice";
import "./postDetail.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import CommentList from "../../components/organisms/CommentList";
import CommentForm from "../../components/molecules/CommentForm";
import PostCard from "../../components/molecules/PostCard";
import Button from "../../components/atoms/Button";

const PostDetail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { posts, loading } = useAppSelector((state) => state.posts);
  const { comments } = useAppSelector((state) => state.comments);
  
  const post = posts.find((p) => p._id === id);

  // Pour gérer l'édition d'un seul commentaire à la fois
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getComments(id));
      if (!post) {
        dispatch(getPostById(id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  if (!post || loading) {
    return (
      <MainLayout
        header={
          <Header 
            user={user ? { name: user.username, avatar: user.avatar } : undefined}
            onLogoClick={() => navigate("/")}
            onProfileClick={() => navigate("/profile")}
            onLogout={() => navigate("/login")}
          />
        }
        footer={<Footer />}
      >
        <div className="post-detail">
          <div className="post-detail__container">
            <p>{loading ? "Chargement..." : "Post non trouvé"}</p>
            <Button onClick={() => navigate("/posts")}>← Retour aux posts</Button>
          </div>
        </div>
      </MainLayout>
    );
  }


  // Passe en mode édition pour un commentaire
  const handleStartEditComment = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  // Annule l'édition
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
  };

  // Sauvegarde la modification
  const handleEditComment = (commentId: string, content: string) => {
    dispatch(updateComment({ commentId, content }));
    setEditingCommentId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment(commentId));
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(toggleLikeComment(commentId));
  };

  const handleLikePost = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (id) {
      await dispatch(toggleLikePost(id));
    }
  };

  return (
    <MainLayout
      header={
        <Header 
          user={user ? { name: user.username, avatar: user.avatar } : undefined}
          onLogoClick={() => navigate("/")}
          onProfileClick={() => navigate("/profile")}
          onLogout={() => navigate("/login")}
        />
      }
      footer={<Footer />}
    >
      <div className="post-detail">
        <div className="post-detail__container">
          <Button variant="secondary" size="sm" onClick={() => navigate("/posts")}>
            ← Retour aux posts
          </Button>

          <div className="post-detail__article">
            <PostCard
              title={post.title}
              content={post.content}
              author={{
                name: post.author?.username || "Unknown",
                avatar: post.author?.avatar ? `http://localhost:5000/uploads/${post.author.avatar}` : undefined,
              }}
              image={post.image ? `http://localhost:5000/uploads/${post.image}` : undefined}

              timestamp={new Date(post.createdAt).toLocaleDateString()}
              likes={post.likes?.length || 0}
              comments={comments.length}
              liked={user ? post.likes?.includes(user._id) || false : false}
              onToggleLike={handleLikePost}
              onOpen={() => {}}
            />
          </div>

          <div className="post-detail__comments">
            <h3 className="post-detail__comments-title">
              Commentaires ({comments.length})
            </h3>
            
            {user ? (
              <CommentForm
                postId={post._id}
                user={{ name: user.username, avatar: user.avatar }}
              />
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>Connectez-vous pour commenter</Button>
            )}

            <CommentList
              comments={comments}
              currentUserId={user?._id}
              editingCommentId={editingCommentId}
              onEdit={handleStartEditComment}
              onCancelEdit={handleCancelEditComment}
              onSaveEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostDetail;