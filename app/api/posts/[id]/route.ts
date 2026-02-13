import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';

// DELETE: Remove a post by ID
export async function DELETE(
  request: Request,
  // FIX 1: Type 'params' as a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    // FIX 2: Await the params object to get the ID
    const { id } = await params;

    const deletedPost = await Post.deleteOne({ _id: id });
    
    if (!deletedPost || deletedPost.deletedCount === 0) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}