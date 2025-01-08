"use client"

import { useEffect, useState } from "react";
import { Send, AlertCircle, Share2, MessageCircle, Sparkles, ChevronLeft } from "lucide-react";
import { PageProps, Post, Topic } from "@/types/PostTypes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black flex items-center justify-center">
        <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black flex items-center justify-center">
        <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-6">
          <CardTitle className="text-white">Topic not found</CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto px-4 py-12"
      >
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="group text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={copyShareLink}
              className="border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>

          <div className="space-y-1">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </span>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="text-gray-400 text-lg">{topic.description}</p>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                Share Your Thoughts
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your message will be posted anonymously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Express yourself freely..."
                  className="min-h-[150px] resize-none bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-gray-100"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 h-12 text-base font-medium"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Anonymously
                </Button>
              </form>
            </CardContent>
          </Card>

          <motion.div variants={containerVariants} className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all">
                  <CardContent className="pt-6">
                    <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-12 text-center text-gray-400">
                    <MessageCircle className="mx-auto h-12 w-12 mb-4 text-gray-500" />
                    <p>No messages yet. Be the first to share your thoughts!</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 