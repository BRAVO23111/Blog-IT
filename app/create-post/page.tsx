"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create a URL-friendly slug from the title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const {  error } = await supabase
        .from('topics')
        .insert([
          { title, description, slug }
        ])
        .select()
        .single();

      if (error) throw error;

      // Copy the share link to clipboard
      const shareLink = `${window.location.origin}/topic/${slug}`;
      await navigator.clipboard.writeText(shareLink);
      
      // Redirect to the new topic page
      router.push(`/topic/${slug}`);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create topic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Anonymous Board
          </h1>
          <p className="text-gray-600">
            Share the link and receive anonymous thoughts and messages
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={createTopic} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Topic Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Share your thoughts about..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Provide more context about your topic..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              "Creating..."
            ) : (
              <>
                <Send size={20} />
                Create & Share
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
