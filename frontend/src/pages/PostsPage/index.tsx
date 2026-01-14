import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import "./postsPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import PostList from "../../components/organisms/PostList";
import PostForm from "../../components/molecules/PostForm";

const MOCK_POSTS = [
  {
    id: "1",
    title: "Getting Started with React",
    content:
      "React is a JavaScript library for building user interfaces. Learn the basics and start building amazing apps!",
    author: { name: "John Doe", avatar: undefined as string | undefined },
    likes: 42,
    comments: 12,
    timestamp: "2 hours ago",
    liked: false,
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    content:
      "TypeScript adds static typing to JavaScript. Here are some best practices to follow when using TypeScript in your projects.",
    author: { name: "Jane Smith", avatar: undefined as string | undefined },
    likes: 38,
    comments: 8,
    timestamp: "5 hours ago",
    liked: true,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox",
    content:
      "When should you use CSS Grid and when should you use Flexbox? This guide will help you decide.",
    author: { name: "Mike Johnson", avatar: undefined as string | undefined },
    likes: 65,
    comments: 24,
    timestamp: "1 day ago",
    liked: false,
  },
];

const PostsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading] = useState(false);

  // Récupérer l'utilisateur depuis Redux
  const user = useAppSelector((state) => state.auth.user);

  const handleCreatePost = (data: { title: string; content: string; image?: string }) => {
    const avatarUrl = user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : undefined;
    const newPost = {
      id: String(Date.now()),
      title: data.title,
      content: data.content,
      author: user ? { name: user.username, avatar: avatarUrl } : { name: "Anonymous", avatar: undefined },
      image: data.image,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (id: string, next: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          liked: next,
          likes: next ? (p.likes ?? 0) + 1 : Math.max(0, (p.likes ?? 0) - 1),
        };
      })
    );
  };

  const handleOpenPost = (id: string) => {
    navigate(`/posts/${id}`);
  };

  const avatarUrl = user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : undefined;
  return (
    <MainLayout
      header={
        <Header
          user={user ? { name: user.username, avatar: avatarUrl } : undefined}
          onLogoClick={() => navigate("/")}
        />
      }
      footer={<Footer />}
    >
      <section className="posts-page">
        <div className="posts-page__container">
          <header className="posts-page__header">
            <h1 className="posts-page__title">Posts</h1>
            <p className="posts-page__subtitle">
              Partagez un post et découvrez ceux des autres (données mockées).
            </p>
          </header>

          <div className="posts-page__create">
            <PostForm
              user={user ? { name: user.username, avatar: avatarUrl } : { name: "Anonymous", avatar: undefined }}
              onSubmit={handleCreatePost}
              loading={loading}
            />
          </div>

          <PostList
            posts={posts}
            loading={loading}
            onOpenPost={handleOpenPost}
            onToggleLike={handleToggleLike}
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default PostsPage;
