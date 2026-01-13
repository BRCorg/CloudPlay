import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./postDetail.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import CommentSection from "../../components/organisms/CommentSection";
import PostCard from "../../components/molecules/PostCard";
import Button from "../../components/atoms/Button";

const MOCK_POST = {
  id: "1",
  title: "Getting Started with React",
  content: `React is a JavaScript library for building user interfaces...`,
  author: { name: "John Doe", avatar: undefined },
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  likes: 42,
  timestamp: "2 hours ago",
  liked: false,
};

const MOCK_COMMENTS = [
  {
    id: "1",
    author: { name: "Jane Smith", avatar: undefined },
    content: "Great article! Very helpful for beginners.",
    timestamp: "1 hour ago",
    likes: 5,
    liked: false,
  },
  {
    id: "2",
    author: { name: "Mike Johnson", avatar: undefined },
    content: "I learned React using this approach and it worked really well!",
    timestamp: "30 minutes ago",
    likes: 3,
    liked: true,
  },
];

const CURRENT_USER = {
  name: "Current User",
  avatar: undefined,
};

const PostDetail = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(MOCK_POST);
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const handleToggleLike = (next: boolean) => {
    setPost((p) => ({
      ...p,
      liked: next,
      likes: next ? p.likes + 1 : Math.max(0, p.likes - 1),
    }));
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: String(Date.now()),
      author: { name: CURRENT_USER.name, avatar: CURRENT_USER.avatar },
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
      header={<Header user={CURRENT_USER} onLogoClick={() => navigate("/")} />}
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
              author={post.author}
              image={post.image}
              likes={post.likes}
              comments={comments.length}
              timestamp={post.timestamp}
              liked={post.liked}
              onToggleLike={handleToggleLike}
            />
          </div>

          <div className="post-detail__comments">
            <CommentSection
              comments={comments}
              user={CURRENT_USER}
              onAdd={handleAddComment}
              onLike={handleLikeComment}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostDetail;
