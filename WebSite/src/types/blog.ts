export interface PostNavigator {
  previousPostId?: string;
  previousPostTitle?: string;
  nextPostId?: string;
  nextPostTitle?: string;
}

export interface BlogPostInfo {
  regDate: string | Date;
  publishDate?: string;
  readMin: string;
  commentCount: number;
}

export interface BlogPostAttributes {
  className?: string;
  href?: string;
  target?: string;
  src?: string;
  alt?: string;
  tweetId?: string;
  icon?: string | [string, string];
  rows?: Record<string, string | number | null>[];
  [key: string]: unknown;
}

export interface BlogPostItem {
  id?: string;
  blogPostId?: string;
  component: string;
  attributes?: BlogPostAttributes;
  children?: (string | BlogPostItem)[];
  sortIndex?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  intro: string;
  imageName: string;
  info: BlogPostInfo;
  navigator: PostNavigator;
  body?: BlogPostItem[];
}

export interface Page {
  PageIndex: number;
  PageSize: number;
}

export interface Pager<T> {
  PageIndex: number;
  PageSize: number;
  ShowingFirstRowIndex: number;
  ShowingLastRowIndex: number;
  TotalPageCount: number;
  TotalRecord: number;
  ViewingRecord: number;
  Rows?: T[] | null;
}

export interface APIResult<T> {
  MessageType: number;
  Message?: string;
  Result?: T;
}
