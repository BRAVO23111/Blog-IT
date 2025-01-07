"use client"

import { useEffect, useState } from "react";
import { Send, AlertCircle, Share2 } from "lucide-react";
import { PageProps, Post, Topic } from "@/types/PostTypes";

export default function TopicPage({ params }: PageProps) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const resolvedSlug = (await params).slug;
        const response = await fetch(`/api/topic?slug=${resolvedSlug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch topic');
        }

        const data = await response.json();
        setTopic(data.topic);
        setPosts(data.posts);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load topic');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicData();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic) return;

    try {
      const response = await fetch('/api/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          topic_id: topic.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setContent("");
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to post message');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Share2 size={20} />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
        {topic.description && (
          <p className="mt-2 text-gray-600">{topic.description}</p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-12 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your anonymous thoughts..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
          Send Anonymously
        </button>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
            <p className="mt-2 text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No messages yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
} 