import React, { useState } from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { Header } from '../../components/organismes/Header';
import { Footer } from '../../components/organismes/Footer';
import { CommentSection } from '../../components/organismes/CommentSection';
import { PostCard } from '../../components/molecules/PostCard';
import { Button } from '../../components/atoms/Button';
import './postDetail.scss';

// Mock data
const MOCK_POST = {
  id: '1',
  title: 'Getting Started with React',
  content: `React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Facebook and a community of individual developers and companies.

React allows developers to create large web applications that can change data without reloading the page. The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application. This corresponds to the view in the MVC template.

Key features of React include:
- Virtual DOM for efficient updates
- Component-based architecture
- One-way data binding
- JSX syntax for writing components`,
  author: { name: 'John Doe', avatar: undefined },
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  likes: 42,
  comments: 3,
  timestamp: '2 hours ago',
  isLiked: false,
};

const MOCK_COMMENTS = [
  {
    id: '1',
    author: { name: 'Jane Smith', username: 'janesmith', avatar: undefined },
    content: 'Great article! Very helpful for beginners.',
    timestamp: '1 hour ago',
    likes: 5,
    isLiked: false,
  },
  {
    id: '2',
    author: { name: 'Mike Johnson', username: 'mikej', avatar: undefined },
    content: 'I learned React using this approach and it worked really well!',
    timestamp: '30 minutes ago',
    likes: 3,
    isLiked: true,
  },
  {
    id: '3',
    author: { name: 'Sarah Wilson', username: 'sarahw', avatar: undefined },
    content: 'Could you also cover React hooks in a future post?',
    timestamp: '10 minutes ago',
    likes: 2,
    isLiked: false,
  },
];

const CURRENT_USER = {
  name: 'Current User',
  avatar: undefined,
};

export const PostDetail: React.FC = () => {
  const [post, setPost] = useState(MOCK_POST);
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const handleLike = () => {
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: String(Date.now()),
      author: { name: CURRENT_USER.name, username: 'currentuser', avatar: CURRENT_USER.avatar },
      content,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    setComments([...comments, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleBack = () => {
    console.log('Navigate back');
    // Navigate back to posts
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
      className="post-detail"
    >
      <div className="post-detail__container">
        <Button variant="ghost" onClick={handleBack} className="post-detail__back">
          ← Back to posts
        </Button>

        <article className="post-detail__article">
          <PostCard
            title={post.title}
            content={post.content}
            author={post.author}
            image={post.image}
            likes={post.likes}
            comments={comments.length}
            timestamp={post.timestamp}
            isLiked={post.isLiked}
            onLike={handleLike}
          />
        </article>

        <section className="post-detail__comments">
          <CommentSection
            comments={comments}
            currentUser={CURRENT_USER}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onReplyComment={(commentId) => console.log('Reply to:', commentId)}
          />
        </section>
      </div>
    </MainLayout>
  );
};

export default PostDetail;
