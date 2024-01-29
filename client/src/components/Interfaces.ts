import { Dispatch, SetStateAction } from "react"

interface LoaderInterface {
  height: string
  styles: string
}


interface ArticlesInterface {
  id: string
  title: string
  article_img_url: string
  description: string
  content: string
  created_at: Date
  updated_at: Date
  tags: {
    id: string
    parent_id: string
    name: string
  }[]
  votes: {
    article_id: string
    user_id: string
  }[]
  comments: {
    id: number
    comment: string
    created_at: Date
    updated_at: Date
    user: {
      id: string
      first_name: string
      last_name: string
    }
  }[]
}[]

interface ArticlesResponse {
  data: ArticlesInterface[]
}

interface ArticleInterface {
  id: string
  title: string
  article_img_url: string
  description: string
  content: string
  created_at: Date
  updated_at: Date
  tags: {
    id: string
    parent_id: string
    name: string
  }[]
  votes: {
    article_id: string
    user_id: string
  }[]
  comments: {
    id: number
    comment: string
    created_at: Date
    updated_at: Date
    user: {
      id: string
      first_name: string
      last_name: string
    }
  }[]
}

interface ArticleResponse {
  data: ArticleInterface
}

interface VoteResponse {
  data: {
    state: string
    user_id: string
    article_id: string
  }
}

interface VoteComponentInterface {
  article: ArticleInterface
  setArticle: Dispatch<SetStateAction<ArticleInterface|undefined>>
  articleId: string|undefined
  voteCheck: boolean|undefined
  setVoteCheck: Dispatch<SetStateAction<boolean|undefined>>
}

interface CommentResponse {
  data: {
    id: 0,
    comment: string
    created_at: Date
    updated_at: Date
    user: {
      id: string
      first_name: string
      last_name: string
    }
  }
}

interface CommentComponentInterface {
  article: ArticleInterface
  setArticle: Dispatch<SetStateAction<ArticleInterface|undefined>>
}

interface AuthorizedCommentComponentInterface {
  article: ArticleInterface
  setArticle: Dispatch<SetStateAction<ArticleInterface|undefined>>
}

interface UsersInterface {
  id: string
  first_name: string
  last_name: string
  role: string
  email: string
  last_login: Date
  created_at: Date
}[]

interface UsersResponse {
  data: UsersInterface[]
}

interface TagsInterface {
  id: string
  parent_id: string
  name: string 
}[]

interface TagsResponse {
  data: TagsInterface[]
}


interface TagInterface {
  id: string
  parent_id: string
  name: string 
}

interface CurrentUserInterface {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface CurrentUserResponse {
  data: CurrentUserInterface
}

interface UserComponentInterface {
  user: CurrentUserInterface
  setUser: Dispatch<SetStateAction<CurrentUserInterface>>
}


export type {ArticlesInterface, ArticlesResponse, ArticleInterface, ArticleResponse, VoteResponse, VoteComponentInterface, CommentResponse,
CommentComponentInterface, AuthorizedCommentComponentInterface, UsersInterface, UsersResponse, TagsInterface, TagsResponse, TagInterface,
CurrentUserInterface, CurrentUserResponse, UserComponentInterface, LoaderInterface}