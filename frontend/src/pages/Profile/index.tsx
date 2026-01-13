import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import UserProfile from "../../components/organisms/UserProfile";
import PostList from "../../components/organisms/PostList";
import Button from "../../components/atoms/Button";

const MOCK_USER = {
  name: "John Doe",
  username: "johndoe",
  avatar: undefined,
  bio: "Software developer passionate about creating amazing user experiences.",
};

const MOCK_POSTS = [
  {
    id: "1",
    title: "My Journey as a Developer",
    content: "Started coding 5 years ago and never looked back. Here is my story...",
    author: { name: "John Doe", avatar: undefined },
    likes: 120,
    comments: 34,
    timestamp: "1 day ago",
    liked: true,
  },
  {
    id: "2",
    title: "Building a Design System",
    content: "Design systems are essential for maintaining consistency across your applications.",
    author: { name: "John Doe", avatar: undefined },
    likes: 89,
    comments: 22,
    timestamp: "3 days ago",
    liked: false,
  },
];

const CURRENT_USER = {
  name: "John Doe",
  avatar: undefined,
};

const Profile = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleOpenPost = (id: string) => {
    navigate(`/posts/${id}`);
  };

  const handleToggleLike = (id: string, next: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const likes = p.likes ?? 0;
        return {
          ...p,
          liked: next,
          likes: next ? likes + 1 : Math.max(0, likes - 1),
        };
      })
    );
  };

  return (
    <MainLayout
      header={<Header user={CURRENT_USER} onLogoClick={() => navigate("/")} />}
      footer={<Footer />}
    >
      <section className="profile">
        <div className="profile__container">
          <Button variant="secondary" size="sm" onClick={() => navigate("/posts")}>
            ← Back
          </Button>

          <UserProfile user={MOCK_USER} />

          <PostList posts={posts} onOpenPost={handleOpenPost} onToggleLike={handleToggleLike} />
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;
