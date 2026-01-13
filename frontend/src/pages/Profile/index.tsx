import React, { useState } from 'react';
import { ProfileLayout } from '../../components/templates/ProfileLayout';
import { Header } from '../../components/organismes/Header';
import { Footer } from '../../components/organismes/Footer';
import { UserProfile } from '../../components/organismes/UserProfile';
import { PostList } from '../../components/organismes/PostList';
import { UserCard } from '../../components/molecules/UserCard';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import './profile.scss';

// Mock data
const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  avatar: undefined,
  coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
  bio: 'Software developer passionate about creating amazing user experiences. Love React, TypeScript, and all things web.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joinDate: 'January 2024',
};

const MOCK_STATS = {
  posts: 42,
  followers: 1234,
  following: 567,
  likes: 890,
};

const MOCK_POSTS = [
  {
    id: '1',
    title: 'My Journey as a Developer',
    content: 'Started coding 5 years ago and never looked back. Here is my story...',
    author: { name: 'John Doe', avatar: undefined },
    likes: 120,
    comments: 34,
    timestamp: '1 day ago',
    isLiked: true,
  },
  {
    id: '2',
    title: 'Building a Design System',
    content: 'Design systems are essential for maintaining consistency across your applications.',
    author: { name: 'John Doe', avatar: undefined },
    likes: 89,
    comments: 22,
    timestamp: '3 days ago',
    isLiked: false,
  },
];

const SUGGESTED_USERS = [
  { name: 'Jane Smith', username: 'janesmith', bio: 'UX Designer' },
  { name: 'Mike Johnson', username: 'mikej', bio: 'Full Stack Dev' },
  { name: 'Sarah Wilson', username: 'sarahw', bio: 'Product Manager' },
];

const CURRENT_USER = {
  name: 'John Doe',
  avatar: undefined,
};

export const Profile: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = true; // This would come from auth context

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEdit = () => {
    console.log('Edit profile');
  };

  const handleBack = () => {
    console.log('Navigate back');
  };

  return (
    <ProfileLayout
      header={
        <Header
          currentUser={CURRENT_USER}
          onLogoClick={() => console.log('Logo clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogout={() => console.log('Logout')}
        />
      }
      footer={<Footer />}
      profile={
        <UserProfile
          user={MOCK_USER}
          stats={MOCK_STATS}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onEdit={handleEdit}
        />
      }
      sidebar={
        <div className="profile__sidebar">
          <Text as="h3" size="lg" weight="semibold" className="profile__sidebar-title">
            Suggested for you
          </Text>
          <div className="profile__suggestions">
            {SUGGESTED_USERS.map((user) => (
              <UserCard
                key={user.username}
                name={user.name}
                username={user.username}
                bio={user.bio}
                variant="minimal"
                action={
                  <Button variant="outline" size="small">
                    Follow
                  </Button>
                }
              />
            ))}
          </div>
        </div>
      }
      backLink={{
        label: 'Back',
        onClick: handleBack,
      }}
      className="profile"
    >
      <div className="profile__content">
        <PostList
          posts={MOCK_POSTS}
          onPostClick={(postId) => console.log('Navigate to post:', postId)}
          onLike={(postId) => console.log('Like post:', postId)}
        />
      </div>
    </ProfileLayout>
  );
};

export default Profile;
