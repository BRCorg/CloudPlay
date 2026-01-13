//---------- Types pour les posts ----------//

export interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
}

export interface PostState {
  loading: boolean;
  error: string | null;
  posts: Post[];
}