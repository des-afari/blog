import { Dispatch, SetStateAction } from "react"

interface ArticlesResponse {
  data: {
    id: string
    title: string
    article_img_url: string
    description: string
    content: string
    created_at: Date
    updated_at: Date
    tags: {
      id: number
      parent_id: number
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
    id: number
    parent_id: number
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

interface ArticleResponse {
  data: {
    id: string
    title: string
    article_img_url: string
    description: string
    content: string
    created_at: Date
    updated_at: Date
    tags: {
      id: number
      parent_id: number
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
    id: number
    parent_id: number
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

interface UsersResponse {
  data: {
    id: string
    first_name: string
    last_name: string
    role: string
    email: string
    last_login: Date
    created_at: Date
  }[]
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

interface TagsResponse {
  data: {
    id: number
    parent_id: number
    name: string 
  }[]
}

interface TagsInterface {
    id: number
    parent_id: number
    name: string 
}[]

interface TagInterface {
    id: number
    parent_id: number
    name: string 
}


export type {ArticlesInterface, ArticlesResponse, ArticleInterface, ArticleResponse, VoteResponse, VoteComponentInterface, CommentResponse,
CommentComponentInterface, AuthorizedCommentComponentInterface, UsersInterface, UsersResponse, TagsInterface, TagsResponse, TagInterface}