import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get a specific topic and its posts
export async function GET(
  request: Request,
  { }: { params: { slug: string } }
) {
  try {
    // Get the slug from the URL
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Fetch topic
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('slug', slug)
      .single();

    if (topicError) throw topicError;
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Fetch posts for this topic
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('topic_id', topic.id)
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    return NextResponse.json({
      topic,
      posts
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

// Create a new post for a topic
export async function POST(request: Request) {
  try {
    const { content, topic_id } = await request.json();

    if (!content || !topic_id) {
      return NextResponse.json(
        { error: 'Content and topic_id are required' },
        { status: 400 }
      );
    }

    const { data: newPost, error } = await supabase
      .from('posts')
      .insert([{ content, topic_id }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
