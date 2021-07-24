import { BlogPost } from "../../pages/blog-post/blogPost";

export interface PostNavigator {
  previousPost?: BlogPost;
  nextPost?: BlogPost;
};
