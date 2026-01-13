import React, { useState } from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { Header } from '../../components/organismes/Header';
import { Footer } from '../../components/organismes/Footer';
import { PostList } from '../../components/organismes/PostList';
import { PostForm } from '../../components/molecules/PostForm';
import { Text } from '../../components/atoms/Text';
import './postsPage.scss';

// Mock data
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'React is a JavaScript library for building user interfaces. Learn the basics and start building amazing apps!',
    author: { name: 'John Doe', avatar: undefined },
    likes: 42,
    comments: 12,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    content: 'TypeScript adds static typing to JavaScript. Here are some best practices to follow when using TypeScript in your projects.',
    author: { name: 'Jane Smith', avatar: undefined },
    likes: 38,
    comments: 8,
    timestamp: '5 hours ago',
    isLiked: true,
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox',
    content: 'When should you use CSS Grid and when should you use Flexbox? This guide will help you decide.',
    author: { name: 'Mike Johnson', avatar: undefined },
    likes: 65,
    comments: 24,
    timestamp: '1 day ago',
    isLiked: false,
  },
];

const CURRENT_USER = {
  name: 'Current User',
  avatar: undefined,
};

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isLoading] = useState(false);

  const handleCreatePost = (data: { title: string; content: string; image?: string }) => {
    const newPost = {
      id: String(Date.now()),
      title: data.title,
      content: data.content,
      author: CURRENT_USER,
      image: data.image,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handlePostClick = (postId: string) => {
    console.log('Navigate to post:', postId);
    // Navigate to post detail
  };

  return (
    <MainLayout
      header={
        <Header
          currentUser={CURRENT_USER}
          onLogoClick={() => console.log('Logo clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogout={() => console.log('Logout')}
        />
      }
      footer={<Footer />}
      className="posts-page"
    >
      <div className="posts-page__container">
        <div className="posts-page__header">
          <Text as="h1" size="3xl" weight="bold">
            Posts
          </Text>
          <Text color="muted">
            Share your thoughts and discover what others are saying
          </Text>
        </div>

        <div className="posts-page__create">
          <PostForm
            currentUser={CURRENT_USER}
            onSubmit={handleCreatePost}
          />
        </div>

        <div className="posts-page__list">
          <PostList
            posts={posts}
            isLoading={isLoading}
            onPostClick={handlePostClick}
            onLike={handleLike}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PostsPage;
