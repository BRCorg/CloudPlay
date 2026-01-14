//---------- Types pour les posts ----------//

export interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  likes?: string[];
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostState {
  loading: boolean;
  error: string | null;
  posts: Post[];
}