import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Project from '@/models/Project';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await dbConnect();
  try {
    const project = await Project.findOne({ slug: params.slug });
    if (!project) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Project.findOneAndUpdate({ slug: params.slug }, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  await dbConnect();
  try {
    await Project.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}