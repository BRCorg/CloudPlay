import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getPosts, createPost } from "../../redux/posts/postsSlice";
import "./postsPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import PostList from "../../components/organisms/PostList";
import PostForm from "../../components/molecules/PostForm";

const PostsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector((state) => state.auth.user);
  const { posts, loading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleToggleLike = (id: string, next: boolean) => {
    // TODO: implémenter l'API like
  };

  const handleOpenPost = (id: string) => {
    navigate(`/posts/${id}`);
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
      <section className="posts-page">
        <div className="posts-page__container">
          <header className="posts-page__header">
            <h1 className="posts-page__title">Posts</h1>
            <p className="posts-page__subtitle">
              Partagez un post et découvrez ceux des autres.
            </p>
          </header>

          <div className="posts-page__create">
            <PostForm
              user={user ? { name: user.username, avatar: user.avatar } : undefined}
            />
          </div>

          <PostList
            posts={posts.map((post) => ({
              id: post._id,
              title: post.title,
              content: post.content,
              author: {
                name: post.author?.username || "Anonymous",
                avatar: post.author?.avatar ? `http://localhost:5000/uploads/${post.author.avatar}` : undefined,
              },
              image: post.image ? `http://localhost:5000/uploads/${post.image}` : undefined,
              likes: 0,
              comments: 0,
              timestamp: new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              liked: false,
            }))}
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
