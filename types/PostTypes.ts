export type Topic = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  slug: string;
}

export type Post = {
  id: number;
  content: string;
  created_at: string;
  topic_id: string;
}

export type PageProps = {
  params: {
    slug: string
  }
}