import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';

// DELETE: Remove a post by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;
    const deletedPost = await Post.deleteOne({ _id: id });
    
    if (!deletedPost) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}