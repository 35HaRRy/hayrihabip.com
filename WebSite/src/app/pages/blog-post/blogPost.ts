import { PostNavigator } from "../../components/blog-navigator/blog-navigator";

export interface BlogPost {
  id: Number;
  body?: string;
  info: {
    publishDate: string;
    readMin: string;
    commentCount: number;
  }
  intro: string;
  navigator: PostNavigator;
  title: string;
};
