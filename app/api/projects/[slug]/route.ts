import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Project from '@/models/Project';

// Define the type for the context (params is a Promise)
type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    // Await params to get the slug
    const { slug } = await params;

    const project = await Project.findOne({ slug });
    if (!project) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const { slug } = await params;
    const body = await req.json();
    
    const updated = await Project.findOneAndUpdate({ slug }, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const { slug } = await params;
    
    await Project.findOneAndDelete({ slug });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}