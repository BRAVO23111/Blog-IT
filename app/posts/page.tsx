"use client"

import { Post } from "@/types/PostTypes";
import { useEffect, useState } from "react";
import { Send, AlertCircle, PenSquare } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Share Your Thoughts</h1>
      
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="mb-12 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
          Post
        </button>
      </form>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <PenSquare className="text-gray-400" size={20} />
            </div>
            <p className="mt-4 text-gray-600 whitespace-pre-wrap">{post.content}</p>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}