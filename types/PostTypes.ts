export type Topic = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  slug: string;
}

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  topic_id: string;
}

export type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
