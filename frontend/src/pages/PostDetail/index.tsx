import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getComments, updateComment, deleteComment, toggleLikeComment } from "../../redux/comments/commentsSlice";
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
  const { posts } = useAppSelector((state) => state.posts);
  const { comments } = useAppSelector((state) => state.comments);
  
  const post = posts.find((p) => p._id === id);

  useEffect(() => {
    if (id) {
      dispatch(getComments(id));
    }
  }, [dispatch, id]);

  if (!post) {
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
            <p>Post non trouvé</p>
            <Button onClick={() => navigate("/posts")}>← Retour aux posts</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleEditComment = (commentId: string, content: string) => {
    dispatch(updateComment({ commentId, content }));
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment(commentId));
  };

  const handleLikeComment = (commentId: string) => {
    dispatch(toggleLikeComment(commentId));
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
              likes={0}
              comments={comments.length}
              liked={false}
              onLike={() => {}}
              onOpen={() => {}}
            />
          </div>

          <div className="post-detail__comments">
            <h3 className="post-detail__comments-title">
              Commentaires ({comments.length})
            </h3>
            
            {user && (
              <CommentForm
                postId={post._id}
                user={{ name: user.username, avatar: user.avatar }}
              />
            )}

            <CommentList
              comments={comments}
              currentUserId={user?._id}
              onEdit={handleEditComment}
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