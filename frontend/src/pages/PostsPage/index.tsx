import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  getPosts,
  deletePost,
  toggleLikePost,
} from "../../redux/posts/postsSlice";
import type { ApiError } from "../../redux/auth/types";
import "./postsPage.scss";

import MainLayout from "../../components/templates/MainLayout";
import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";

import PostList from "../../components/organisms/PostList";
import PostForm from "../../components/molecules/PostForm";

// Page d'affichage et de gestion des posts
const PostsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Récupère l'utilisateur courant et les posts depuis le store
  const user = useAppSelector((state) => state.auth.user);
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  // Cast error to the correct type for PostForm
  const postFormError = error as
    | string
    | string[]
    | ApiError
    | null;

  // Gère l'état du post en cours d'édition
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Charge les posts au montage
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // Remonte en haut de la page lors du passage en mode édition
  useEffect(() => {
    if (editingPostId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editingPostId]);

  // Efface l'erreur lors du passage en mode édition
  useEffect(() => {
    if (editingPostId) {
      dispatch({ type: "posts/clearPostError" });
    }
  }, [editingPostId, dispatch]);

  // Gestion du like sur un post
  const handleToggleLike = async (id: string) => {
    await dispatch(toggleLikePost(id));
  };

  // Ouvre le détail d'un post
  const handleOpenPost = (id: string) => {
    navigate(`/posts/${id}`);
  };

  // Passe en mode édition pour un post
  const handleEditPost = (id: string) => {
    setEditingPostId(id);
  };

  // Supprime un post
  const handleDeletePost = async (id: string) => {
    await dispatch(deletePost(id));
  };

  // Trouve le post en cours d'édition
  const editingPost = posts.find((p) => p._id === editingPostId);

  // ------------------- Rendu du composant -------------------//
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
          {/* En-tête de la page */}
          <header className="posts-page__header">
            <h1 className="posts-page__title">Posts</h1>
            <p className="posts-page__subtitle">
              Partagez un post et découvrez ceux des autres.
            </p>
          </header>

          {/* Formulaire de création ou d'édition de post (uniquement si connecté) */}
          {user && (
            <div className="posts-page__create">
              {editingPost ? (
                <div className="posts-page__edit">
                  <h3 className="posts-page__edit-title">Modifier le post</h3>
                  <PostForm
                    user={{ name: user.username, avatar: user.avatar }}
                    editMode
                    postId={editingPost._id}
                    initialTitle={editingPost.title}
                    initialContent={editingPost.content}
                    initialImage={
                      editingPost.image
                        ? `http://localhost:5000/uploads/${editingPost.image}`
                        : undefined
                    }
                    onCancel={() => setEditingPostId(null)}
                    error={postFormError}
                    loading={loading}
                  />
                </div>
              ) : (
                <PostForm
                  user={{ name: user.username, avatar: user.avatar }}
                  error={postFormError}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* Liste des posts */}
          <PostList
            posts={posts.map((post) => ({
              id: post._id,
              title: post.title,
              content: post.content,
              author: {
                name: post.author?.username || "Anonymous",
                avatar: post.author?.avatar
                  ? `http://localhost:5000/uploads/${post.author.avatar}`
                  : undefined,
              },
              image: post.image
                ? `http://localhost:5000/uploads/${post.image}`
                : undefined,
              likes: post.likes?.length || 0,
              comments: post.commentCount || 0,
              timestamp: new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              liked: user ? post.likes?.includes(user._id) || false : false,
              isAuthor: user?._id === post.author?._id,
              onEdit: () => handleEditPost(post._id),
              onDelete: () => handleDeletePost(post._id),
              // Ne passe onToggleLike que si user est connecté
              ...(user ? { onToggleLike: () => handleToggleLike(post._id) } : {}),
            }))}
            loading={loading}
            onOpenPost={handleOpenPost}
            // onToggleLike n'est plus passé globalement, mais par post
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default PostsPage;
