import { PostNavigator } from "../../components/blog-navigator/blog-navigator";

export interface BlogPost {
  id: string;
  body?: BlogPostItem[];
  info: {
    publishDate: string;
    readMin: string;
    commentCount: number;
  }
  intro: string;
  navigator: PostNavigator;
  title: string;
}

export interface BlogPostItem {
  id: string;
  blogPostId: string;
  component: string;
  attributes?: {
    [key: string]: any;
  };
  children?: (string | BlogPostItem)[];
  sortIndex: number;
}
