"use client"

import { Post } from "@/types/PostTypes";
import { useEffect, useState } from "react";



export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      const newPost = await response.json();
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again later.');
    }
  };

  return (
    <>
      <h1>Posts</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">Add Post</button>
      </form>
      {posts.map((post: Post) => (
        <div key={post.id}>
          <h2>Title: {post.title}</h2>
          <p>Content: {post.content}</p>
          <p>Date: {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </>
  );
}