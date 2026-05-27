export interface Author {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  social: {
    twitter: string;
    github: string;
    website: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: Category;
  tags: Tag[];
  author: Author | null;
  status: "draft" | "published";
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
