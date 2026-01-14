import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import "./postDetail.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import CommentSection from "../../components/organisms/CommentSection";
import PostCard from "../../components/molecules/PostCard";
import Button from "../../components/atoms/Button";

const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { posts } = useAppSelector((state) => state.posts);
  
  const post = posts.find((p) => p._id === id);
  const [comments, setComments] = useState<any[]>([]);

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

  const handleAddComment = (content: string) => {
    const newComment = {
      id: String(Date.now()),
      author: { name: user?.username || "Anonymous", avatar: user?.avatar },
      content,
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleLikeComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = !c.liked;
        return {
          ...c,
          liked: next,
          likes: next ? (c.likes ?? 0) + 1 : Math.max(0, (c.likes ?? 0) - 1),
        };
      })
    );
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
            <CommentSection
              comments={comments}
              currentUser={user ? { name: user.username, avatar: user.avatar } : undefined}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostDetail;
