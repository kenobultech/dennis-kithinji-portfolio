// posts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';

// GET: Fetch all posts
export async function GET() {
  await dbConnect();
  try {
    // Sort by newest first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST: Create a new post
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const post = await Post.create(body);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}