import { PostNavigator } from "../../components/blog-navigator/blog-navigator";

export interface BlogPost {
  id: number;
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
  component: string;
  attributes?: {
    [key: string]: any;
  };
  children?: (string | BlogPostItem)[];
}
